import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from '@app/material.module';
import { ToolbarLinkModule } from '@shared/components/toolbar-link';
import { ToolbarOptionsModule } from '@shared/components/toolbar-options';
import { CdkDetailRowDirective, NoWhitespaceDirective } from '@shared/directives';


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
    NoWhitespaceDirective
  ],
  providers: []
})
export class SharedModule {
}
