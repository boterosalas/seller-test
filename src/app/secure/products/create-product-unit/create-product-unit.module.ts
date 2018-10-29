import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { CreateUnutaryProductComponent } from './create-unutary-product/create-unutary-product.component';
import { UnitProductRoutingModule } from '@app/secure/products/create-product-unit/create-product-unit.routing';
import { ComponentProcessComponent } from './component-process/component-process.component';
import { ValidateEanComponent } from '@app/secure/products/create-product-unit/validate-ean/validate-ean.component';
import { SearchCategorizationComponent } from './categorization/search.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from './categorization/search.component.service';
import { ListCategorizationComponent  } from './categorization/list/list.component';
import { TreeComponent  } from './categorization/list/tree.component';
import { AssignImagesComponent } from './assign-images/assign-images.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    UnitProductRoutingModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent,
    ValidateEanComponent,
    SearchCategorizationComponent,
    ListCategorizationComponent,
    TreeComponent,
    AssignImagesComponent
  ],
  exports: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent,
    ValidateEanComponent,
    SearchCategorizationComponent,
    ListCategorizationComponent,
    TreeComponent,
    AssignImagesComponent
  ],
  entryComponents: [
  ],
  providers: [
    SearchService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class UnitProductModule {
}
