import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent } from '@app/core/shell';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';

import { DownloadFormatComponent } from './download-format/download-format.component';
import { FinishUploadInformationComponent } from './finish-upload-information/finish-upload-information.component';
import { LoadGuideRoutingModule } from './load-guide.routing';
import { LoadGuideService } from './load-guide.service';
import { LoadGuidePageComponent } from './load-guide/load-guide-page.component';
import { TableErrorsComponent } from './table-errors/table-errors.component';
import { TableLoadComponent } from './table-load/table-load.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadGuideRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [
    LoadGuidePageComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    DownloadFormatComponent,
    TableLoadComponent
  ],
  exports: [
    LoadGuidePageComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    DownloadFormatComponent,
    TableLoadComponent
  ],
  entryComponents: [
    DownloadFormatComponent,
    FinishUploadInformationComponent
  ],
  providers: [
    ComponentsService,
    LoadGuideService,
    ShellComponent,
    LoadGuidePageComponent,
    EventEmitterOrders,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class LoadGuideModule {
}
