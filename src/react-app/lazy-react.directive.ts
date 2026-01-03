import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import type { ComponentProps, ElementType } from 'react';
import type { Root } from 'react-dom/client';

type ReactModule = typeof import('react');
type ReactDOMModule = typeof import('react-dom/client');
type ErrorBoundaryComponentType = typeof import('ui-lib-react').ErrorBoundary;

@Directive({
  selector: '[reactComponent]',
  standalone: true,
})
export class LazyReactComponentDirective<Comp extends ElementType> implements OnInit, OnChanges, OnDestroy {
  @Input() reactComponent!: () => Promise<Comp>;
  @Input() props: ComponentProps<Comp> = {} as ComponentProps<Comp>;

  private root: Root | null = null;
  private reactModulesPromise: Promise<[ReactModule, ReactDOMModule, ErrorBoundaryComponentType]> | null = null;
  private isDestroyed = false;

  constructor(
    @Inject(ElementRef) private host: ElementRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    if (!this.reactComponent) {
      throw new Error('LazyReactComponentDirective: reactComponent input is required.');
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);

    if (this.isDestroyed) return;

    try {
      // Cache React module imports to avoid re-importing on every prop change
      if (!this.reactModulesPromise) {
        this.reactModulesPromise = Promise.all([
          import('react'),
          import('react-dom/client'),
          import('ui-lib-react').then((m) => m.ErrorBoundary)
        ]);
      }

      const [React, ReactDOM, ReactErrorBoundary] = await this.reactModulesPromise;
      const reactComponent = await this.reactComponent();

      if (this.isDestroyed) return;

      // Create root only once
      if (!this.root) {
        this.root = ReactDOM.createRoot(this.host.nativeElement);
      }

      // Wrap props functions to run in Angular zone for change detection
      const wrappedProps = this.wrapCallbacksInZone(this.props);

      // Wrap component in ErrorBoundary to catch React errors
      const wrappedElement = React.createElement(
        ReactErrorBoundary,
        {
          onError: (error: Error, errorInfo: any) => {
            console.error('React component error:', error, errorInfo);
            // Could integrate with Angular's ErrorHandler here
          },
        },
        React.createElement(reactComponent, wrappedProps)
      );

      // Render component with error boundary
      this.root.render(wrappedElement);
    } catch (err) {
      console.error('Error in LazyReactComponentDirective:', err);
      // You could integrate with Angular's ErrorHandler here
      this.renderErrorFallback();
    }
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

   // Wraps callback functions in props to run within Angular's zone
   // This ensures Angular change detection runs when React components trigger callbacks
  private wrapCallbacksInZone(props: any): any {
    if (!props || typeof props !== 'object') {
      return props;
    }

    const wrapped: Record<string, any> = {};

    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key];

        if (typeof value === 'function') {
          // Wrap function to run in Angular zone
          wrapped[key] = (...args: any[]) => {
            return this.ngZone.run(() => value(...args));
          };
        } else if (typeof value === 'object' && value !== null) {
          // Recursively wrap nested objects (but avoid infinite loops)
          if (key !== 'subject' && key !== 'ref') {
            wrapped[key] = this.wrapCallbacksInZone(value);
          } else {
            wrapped[key] = value;
          }
        } else {
          wrapped[key] = value;
        }
      }
    }

    return wrapped;
  }

  // Renders a simple error fallback when React component fails to load
  private renderErrorFallback() {
    this.host.nativeElement.innerHTML = `
      <div style="padding: 1rem; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c00;">
        <strong>Error:</strong> Failed to load React component.
      </div>
    `;
  }
}
