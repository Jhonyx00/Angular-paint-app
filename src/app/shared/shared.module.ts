import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { AuxDivComponent } from './components/aux-div/aux-div.component';

@NgModule({
  declarations: [DynamicHostDirective, AuxDivComponent],
  imports: [CommonModule],
  exports: [DynamicHostDirective, AuxDivComponent],
})
export class SharedModule {}
