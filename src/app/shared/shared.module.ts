import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeContainerComponent } from './components/shape-container/shape-container.component';

@NgModule({
  declarations: [ShapeContainerComponent],
  imports: [CommonModule],
  exports: [ShapeContainerComponent],
})
export class SharedModule {}
