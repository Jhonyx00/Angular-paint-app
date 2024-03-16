import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CanvasComponent } from './website/components/canvas/canvas.component';
import { FormsModule } from '@angular/forms';
import { FiguresComponent } from './website/components/toolbar/components/shapes/shapes.component';
import { ColorComponent } from './website/components/toolbar/components/color/color.component';
import { StatusComponent } from './website/components/status/status.component';
import { ToolbarComponent } from './website/components/toolbar/components/tools-container/tools-container.component';
import { OptionsComponent } from './website/components/toolbar/components/file/file.component';
import { ActionsComponent } from './website/components/toolbar/components/actions/actions.component';
import { PencilsComponent } from './website/components/toolbar/components/pencils/pencils.component';
import { ErasersComponent } from './website/components/toolbar/components/erasers/erasers.component';
import { SelectComponent } from './website/components/toolbar/components/select/select.component';

import { SharedModule } from './shared/shared.module';
import { ToolComponent } from './website/components/toolbar/components/tool/tool.component';

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
    ToolComponent,
    // AuxDivComponent,
    // DynamicHostDirective,
  ],
  imports: [BrowserModule, FormsModule, SharedModule],
  bootstrap: [AppComponent],
  // exports: [AuxDivComponent, DynamicHostDirective],
  // providers: [CanvasComponent],
})
export class AppModule {}
