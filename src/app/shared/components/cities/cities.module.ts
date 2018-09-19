import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { ToolbarOptionsModule } from '@app/shared/components/toolbar-options';

import { CitiesComponent } from './cities.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    ToolbarOptionsModule
  ],
  declarations: [
    CitiesComponent
  ],
  exports: [
    CitiesComponent
  ],
  providers: []
})
export class CitiesModule {
}
