/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* our own custom components */
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';
import { TableLoadProductComponent } from './table-load-product/table-load-product.component';
import { BulkLoadProductService } from './bulk-load-product.service';
import { TableErrorsProductComponent } from './table-errors-product/table-errors-product.component';
import { FinishUploadProductInformationComponent } from './finish-upload-product-information/finish-upload-product-information.component';
import { BulkLoadProductRoutingModule } from './bulk-load-product.routing';
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
    BulkLoadProductRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [
    BulkLoadProductComponent,
    FinishUploadProductInformationComponent,
    BulkLoadProductComponent,
    TableLoadProductComponent,
    TableErrorsProductComponent
  ],
  exports: [
    BulkLoadProductComponent,
    FinishUploadProductInformationComponent,
    BulkLoadProductComponent,
    TableLoadProductComponent,
    TableErrorsProductComponent
  ],
  entryComponents: [
    FinishUploadProductInformationComponent
  ],
  providers: [
    ComponentsService,
    BulkLoadProductService,
    HttpErrorHandlingService,
    EndpointService,
    UserService,
    ShellComponent,
    BulkLoadProductComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class BulkLoadProductModule {
}
