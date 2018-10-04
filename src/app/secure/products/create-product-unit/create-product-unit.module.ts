import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { CreateUnutaryProductComponent } from './create-unutary-product/create-unutary-product.component';
import { UnitProductRoutingModule } from '@app/secure/products/create-product-unit/create-product-unit.routing';
import { ComponentProcessComponent } from './component-process/component-process.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    UnitProductRoutingModule,
    MaterialModule
  ],
  declarations: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent
  ],
  exports: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent
  ],
  entryComponents: [
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class UnitProductModule {
}
