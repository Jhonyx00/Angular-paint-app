import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CanvasComponent } from './website/components/canvas/canvas.component';
import { FormsModule } from '@angular/forms';
import { FiguresComponent } from './website/components/figures/figures.component';
import { ColorComponent } from './website/components/color/color.component';
import { StatusComponent } from './website/components/status/status.component';
import { ToolbarComponent } from './website/components/toolbar/toolbar.component';
import { OptionsComponent } from './website/components/options/options.component';
import { ActionsComponent } from './website/components/actions/actions.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    FiguresComponent,
    ColorComponent,
    StatusComponent,
    ToolbarComponent,
    OptionsComponent,
    ActionsComponent,
  ],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent],
  // providers: [CanvasComponent],
})
export class AppModule {}
