import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@app/material.module';
import { ToolbarLinkModule } from '@shared/components/toolbar-link';
import { ToolbarOptionsModule } from '@shared/components/toolbar-options';
import { CdkDetailRowDirective, NoWhitespaceDirective } from '@shared/directives';
import { StatesModule } from '@shared/components/states';
import { CitiesModule } from '@shared/components/cities';


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
    ToolbarLinkModule,
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesModule,
    CitiesModule
  ],
  providers: []
})
export class SharedModule {
}
