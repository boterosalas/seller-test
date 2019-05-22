import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@shared/shared.module';

import { BulkLoadProductRoutingModule } from './bulk-load-product.routing';
import { BulkLoadProductService } from './bulk-load-product.service';
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';
import {
  FinishUploadProductInformationComponent
} from './finish-upload-product-information/finish-upload-product-information.component';
import { TableErrorsProductComponent } from './table-errors-product/table-errors-product.component';
import { TableLoadProductComponent } from './table-load-product/table-load-product.component';
import { ParameterizeModule } from '@app/secure/parameterize/parameterize.module';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    BulkLoadProductRoutingModule,
    BrowserAnimationsModule,
    ParameterizeModule
  ],
  declarations: [
    BulkLoadProductComponent,
    FinishUploadProductInformationComponent,
    BulkLoadProductComponent,
    TableLoadProductComponent,
    TableErrorsProductComponent,
  ],
  exports: [
    BulkLoadProductComponent,
    FinishUploadProductInformationComponent,
    BulkLoadProductComponent,
    TableLoadProductComponent,
    TableErrorsProductComponent
  ],
  entryComponents: [
    FinishUploadProductInformationComponent,
    DialogWithFormComponent
  ],
  providers: [
    ComponentsService,
    BulkLoadProductService,
    ShellComponent,
    BulkLoadProductComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class BulkLoadProductModule {
}
