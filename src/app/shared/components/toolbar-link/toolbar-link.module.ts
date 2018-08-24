import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { ToolbarOptionsModule } from '@app/shared/components/toolbar-options';

import { ToolbarLinkComponent } from './toolbar-link.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ToolbarOptionsModule
  ],
  declarations: [
    ToolbarLinkComponent
  ],
  exports: [
    ToolbarLinkComponent
  ],
  providers: []
})
export class ToolbarLinkModule {
}
