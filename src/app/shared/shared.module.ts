import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeContainerComponent } from './components/shape-container/shape-container.component';
import { FixedSizeDirective } from './directives/fixed-size.directive';
import { FixedBorderDirective } from './directives/fixed-border.directive';
import { ToolMenuComponent } from './components/tool-menu/tool-menu.component';

@NgModule({
  declarations: [
    ShapeContainerComponent,
    FixedSizeDirective,
    FixedBorderDirective,
    ToolMenuComponent,
  ],
  imports: [CommonModule],
  exports: [ShapeContainerComponent],
})
export class SharedModule {}
