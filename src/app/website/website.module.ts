import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { ToolComponent } from './components/tool/tool.component';
import { ZoomDirective } from './directives/zoom.directive';

@NgModule({
  declarations: [
    CanvasComponent,
    ColorPaletteComponent,
    StatusBarComponent,
    ToolComponent,
    ZoomDirective,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    CanvasComponent,
    ColorPaletteComponent,
    StatusBarComponent,
    ToolComponent,
  ],
})
export class WebsiteModule {}
