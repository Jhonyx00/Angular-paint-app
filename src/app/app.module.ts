import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { WebsiteModule } from './website/website.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedModule, WebsiteModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
