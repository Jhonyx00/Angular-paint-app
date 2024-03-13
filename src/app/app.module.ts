import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CanvasComponent } from './website/components/canvas/canvas.component';
import { FormsModule } from '@angular/forms';
import { FiguresComponent } from './website/components/shapes/shapes.component';
import { ColorComponent } from './website/components/color/color.component';
import { StatusComponent } from './website/components/status/status.component';
import { ToolbarComponent } from './website/components/toolbar/components/tools/toolbar.component';
import { OptionsComponent } from './website/components/file/file.component';
import { ActionsComponent } from './website/components/actions/actions.component';
import { PencilsComponent } from './website/components/pencils/pencils.component';
import { ErasersComponent } from './website/components/erasers/erasers.component';
import { SelectComponent } from './website/components/select/select.component';

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
    PencilsComponent,
    ErasersComponent,
    SelectComponent,
  ],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent],
  // providers: [CanvasComponent],
})
export class AppModule {}
