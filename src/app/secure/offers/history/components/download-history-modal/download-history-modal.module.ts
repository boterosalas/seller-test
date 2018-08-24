/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* our own custom components */
import {DownloadHistoryModalComponent} from './download-history-modal.component';
import {DownloadHistoryService} from '@app/secure/offers/history/components/download-history-modal/download-history.service';
import { MaterialModule } from '../../../../material-components';
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
    DownloadHistoryModalComponent
  ],
  entryComponents: [
    DownloadHistoryModalComponent
  ],
  providers: [
    DownloadHistoryService,
    HttpErrorHandlingService,
    ComponentsService,
    UserService,
    EndpointService,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class DownloadHistoryModalModule {
}
