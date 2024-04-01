import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { ShapeContainerComponent } from './components/shape-container/shape-container.component';

@NgModule({
  declarations: [DynamicHostDirective, ShapeContainerComponent],
  imports: [CommonModule],
  exports: [DynamicHostDirective, ShapeContainerComponent],
})
export class SharedModule {}
