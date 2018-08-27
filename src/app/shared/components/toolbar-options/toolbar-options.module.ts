import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { DownloadOrderModalModule } from '@secure/orders/download-order-modal/download-order-modal.module';

import { ToolbarOptionsComponent } from './toolbar-options.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DownloadOrderModalModule
  ],
  declarations: [
    ToolbarOptionsComponent,
  ],
  exports: [
    ToolbarOptionsComponent,
  ],
  providers: []
})
export class ToolbarOptionsModule {
}
