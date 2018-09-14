import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@app/material.module';
import { ToolbarOptionsModule } from './components/toolbar-options';
import { CdkDetailRowDirective, NoWhitespaceDirective } from './directives';
import { StatesModule } from './components/states';
import { CitiesModule } from './components/cities';
import { ToolbarTittleModule } from './components/toolbar-tittle';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    CdkDetailRowDirective,
    NoWhitespaceDirective
  ],
  exports: [
    MaterialModule,
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesModule,
    CitiesModule,
    ToolbarTittleModule
  ],
  providers: []
})
export class SharedModule {
}
