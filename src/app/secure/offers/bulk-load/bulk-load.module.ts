import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@shared/shared.module';

import { BulkLoadRoutingModule } from './bulk-load.routing';
import { BulkLoadService } from './bulk-load.service';
import { BulkLoadComponent } from './bulk-load/bulk-load.component';
import { FinishUploadInformationComponent } from './finish-upload-information/finish-upload-information.component';
import { TableErrorsComponent } from './table-errors/table-errors.component';
import { TableLoadComponent } from './table-load/table-load.component';
import { ModalSendEmailComponent } from './modal-send-email/modal-send-email.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    BulkLoadRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [
    BulkLoadComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    TableLoadComponent,
    ModalSendEmailComponent
  ],
  exports: [
    BulkLoadComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    TableLoadComponent
  ],
  entryComponents: [
    FinishUploadInformationComponent,
    ModalSendEmailComponent
  ],
  providers: [
    ComponentsService,
    BulkLoadService,
    ShellComponent,
    BulkLoadComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class BulkLoadModule {
}
