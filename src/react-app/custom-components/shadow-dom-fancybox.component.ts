import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import type { ComponentProps, ElementType } from 'react';
import { LazyReactComponentDirective } from '../lazy-react.directive';

@Component({
  standalone: true,
  selector: 'shadow-app-react-wrapper',
  imports: [LazyReactComponentDirective],
  template: '<div [id]="rootId" [reactComponent]="FancyBox" [props]="props"></div>',
  styleUrls: [
    '../../../node_modules/ui-lib-react/dist/lib.css',
    '../../../node_modules/ui-lib-react/dist/FancyBox.css'
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ShadowDomFancyBoxComponent<E extends ElementType = ElementType>
  implements OnInit {
  // @Input() component!: () => Promise<E>;
  @Input() props: ComponentProps<E> & Record<string, any> = {} as ComponentProps<E>;
  @Input() rootId!: string;

  FancyBox = () => import('ui-lib-react').then((m) => m.FancyBox);

  constructor() { }

  ngOnInit() {
    if (!this.rootId) {
      throw new Error('Property `rootId` is required');
    }
  }
}