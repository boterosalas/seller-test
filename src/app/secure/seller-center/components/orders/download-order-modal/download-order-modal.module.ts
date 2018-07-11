/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/* our own custom components */
import {DownloadOrderModalComponent} from './download-order-modal.component';
import {DownloadOrderService} from './download-order.service';
import { MaterialModule } from '../../material-components';
import { HttpErrorHandlingService } from '../../../utils/http/http-error-handling.service';
import { ComponentsService } from '../../../utils/services/common/components/components.service';
import { UserService } from '../../../utils/services/common/user/user.service';
import { EndpointService } from '../../../utils/http/endpoint.service';

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
    DownloadOrderModalComponent
  ],
  entryComponents: [
    DownloadOrderModalComponent
  ],
  providers: [
    DownloadOrderService,
    HttpErrorHandlingService,
    ComponentsService,
    UserService,
    EndpointService,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class DownloadOrderModalModule {
}
