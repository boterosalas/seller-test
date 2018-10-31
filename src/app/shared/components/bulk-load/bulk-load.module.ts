import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';

import { BulkLoadComponent } from './bulk-load/bulk-load.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  declarations: [
    BulkLoadComponent
  ],
  exports: [
    BulkLoadComponent
  ]
})
export class BulkLoadModule {
}
