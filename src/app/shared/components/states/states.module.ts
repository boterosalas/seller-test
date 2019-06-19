import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { ToolbarOptionsModule } from '@app/shared/components/toolbar-options';

import { StatesComponent } from './states.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    StatesComponent
  ],
  exports: [
    StatesComponent
  ],
  providers: []
})
export class StatesModule {
}
