import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[shapeContainer]',
})
export class DynamicHostDirective {
  constructor(public _viewContainerRef: ViewContainerRef) {}
}
