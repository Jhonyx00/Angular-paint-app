import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CanvasComponent } from './components/canvas/canvas.component';
import { ColorPaletteComponent } from './components/color-palette/color-palette.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ToolComponent } from './components/tool/tool.component';

@NgModule({
  declarations: [
    CanvasComponent,
    ColorPaletteComponent,
    StatusBarComponent,
    ToolbarComponent,
    ToolComponent,
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    CanvasComponent,
    ColorPaletteComponent,
    StatusBarComponent,
    ToolbarComponent,
    ToolComponent,
  ],
})
export class WebsiteModule {}
