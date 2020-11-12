import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '@app/material.module';

import { TranslateModule } from '@ngx-translate/core';
import { DownloadReportListCancelsComponent } from './download-report-list-cancels.component';
import { ListDownloadOrdersService } from './download-report-list-cancels.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule
  ],
  declarations: [
    DownloadReportListCancelsComponent
  ],
  entryComponents: [
    DownloadReportListCancelsComponent
  ],
  providers: [
    ListDownloadOrdersService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class DownloadListCancelsModalModule {
}
