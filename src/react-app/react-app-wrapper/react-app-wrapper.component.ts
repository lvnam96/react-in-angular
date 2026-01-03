import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LazyReactComponentDirective } from '../lazy-react.directive';
import type { ComponentProps, ElementType } from 'react';

@Component({
  standalone: true,
  selector: 'app-react-wrapper',
  imports: [LazyReactComponentDirective],
  template: '<div [id]="rootId" [reactComponent]="component" [props]="props"></div>',
})
export class ReactWrapperComponent<E extends ElementType = ElementType>
  implements OnInit
{
  @Input() component!: () => Promise<E>;
  @Input() props: ComponentProps<E> & Record<string, any> =
    {} as ComponentProps<E>;
  @Input() rootId!: string;

  constructor() {}

  ngOnInit() {
    if (!this.rootId) {
      throw new Error('Property `rootId` is required');
    }
  }
}
