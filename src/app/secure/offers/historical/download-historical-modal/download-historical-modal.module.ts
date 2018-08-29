/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* our own custom components */
import {DownloadHistoricalModalComponent} from './download-historical-modal.component';
import {DownloadHistoricalService} from '@app/secure/offers/historical/download-historical-modal/download-historical.service';
import { MaterialModule } from '../../../material-components';
import { HttpErrorHandlingService, ComponentsService, UserService, EndpointService } from '@app/shared';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  declarations: [
    DownloadHistoricalModalComponent
  ],
  entryComponents: [
    DownloadHistoricalModalComponent
  ],
  providers: [
    DownloadHistoricalService,
    HttpErrorHandlingService,
    ComponentsService,
    UserService,
    EndpointService,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class DownloadHistoricalModalModule {
}
