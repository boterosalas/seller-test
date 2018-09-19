import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { SupportModalComponent } from './support-modal.component';
import { SupportService } from './support.service';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  declarations: [
    SupportModalComponent
  ],
  exports: [
    SupportModalComponent
  ],
  providers: [
    SupportService,
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class SupportModule {
}
