import { Component, Input } from '@angular/core';
import type { ComponentProps } from 'react';
import { LazyReactComponentDirective } from '../lazy-react.directive';

@Component({
  selector: 'react-select',
  standalone: true,
  imports: [LazyReactComponentDirective],
  template: `<div
    [reactComponent]="Select"
    [props]="selectComponentProps"
  ></div>`,
})
export class ReactSelectComponent {
  @Input('props') protected selectComponentProps: ComponentProps<
    typeof import('react-select').default
  > = {
    onChange(v) {
      console.log(v);
    },
    options: [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ],
  };

  protected Select = () => import('react-select').then((m) => m.default);
}
