import {
  Directive,
  ElementRef,
  Inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import type { ComponentProps, ElementType } from 'react';
import type { Root } from 'react-dom/client';

@Directive({
  selector: '[reactComponent]',
  standalone: true,
})
export class LazyReactComponentDirective<Comp extends ElementType> {
  @Input() reactComponent!: () => Promise<Comp>;
  @Input() props: ComponentProps<Comp> = {} as ComponentProps<Comp>;

  private root: Root | null = null;

  constructor(@Inject(ElementRef) private host: ElementRef) {}

  async ngOnChanges(changes: SimpleChanges) {
    console.log('AAAAAAAAAAAAA', changes);
    try {
      const [{ createElement }, { createRoot }, reactComponent] =
        await Promise.all([
          import('react'),
          import('react-dom/client'),
          this.reactComponent(),
        ]);

      if (!this.root) {
        this.root = createRoot(this.host.nativeElement);
      }

      this.root.render(createElement(reactComponent, this.props));
    } catch (err) {
      console.error('Error in LazyReactComponentDirective:', err);
    }
  }

  ngOnDestroy() {
    this.root?.unmount();
  }
}
