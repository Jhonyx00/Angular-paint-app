import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CanvasComponent } from './website/components/canvas/canvas.component';
import { ColorComponent } from './website/components/toolbar/components/color-palette/color-palette.component';
import { StatusComponent } from './website/components/status/status.component';
import { ToolbarComponent } from './website/components/toolbar/components/tools-container/tools-container.component';
import { SharedModule } from './shared/shared.module';
import { ToolComponent } from './website/components/toolbar/components/tool/tool.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorComponent,
    StatusComponent,
    ToolbarComponent,
    ToolComponent,
  ],
  imports: [BrowserModule, SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
