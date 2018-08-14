/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* our own custom components */
import { BulkLoadComponent } from './bulk-load/bulk-load.component';
import { TableLoadComponent } from './table-load/table-load.component';
import { BulkLoadService } from './bulk-load.service';
import { TableErrorsComponent } from './table-errors/table-errors.component';
import { FinishUploadInformationComponent } from './finish-upload-information/finish-upload-information.component';
import { BulkLoadRoutingModule } from './bulk-load.routing';
import { MaterialModule } from '../../../material.module';
import {
  ComponentsService,
  HttpErrorHandlingService,
  EndpointService,
  UserService,
  EventEmitterOrders
} from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    BulkLoadRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [
    BulkLoadComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    TableLoadComponent
  ],
  exports: [
    BulkLoadComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    TableLoadComponent
  ],
  entryComponents: [
    FinishUploadInformationComponent
  ],
  providers: [
    ComponentsService,
    BulkLoadService,
    HttpErrorHandlingService,
    EndpointService,
    UserService,
    ShellComponent,
    BulkLoadComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class BulkLoadModule {
}
