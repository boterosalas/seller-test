import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent } from '@app/core/shell';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';

import { BulkLoadProductRoutingModule } from './bulk-load-product.routing';
import { BulkLoadProductService } from './bulk-load-product.service';
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';
import {
  FinishUploadProductInformationComponent
} from './finish-upload-product-information/finish-upload-product-information.component';
import { TableErrorsProductComponent } from './table-errors-product/table-errors-product.component';
import { TableLoadProductComponent } from './table-load-product/table-load-product.component';


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
    ShellComponent,
    BulkLoadProductComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class BulkLoadProductModule {
}
