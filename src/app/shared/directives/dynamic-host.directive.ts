import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[DynamicDiv]',
})
export class DynamicHostDirective {
  constructor(public _viewContainerRef: ViewContainerRef) {}
}
