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
import { ProductBasicInfoComponent  } from './basic-information/basic-information.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { SpecificationService } from './specifications/specification.component.service';
import { ProcessService } from './component-process/component-process.service';
import { AssignImagesComponent } from './assign-images/assign-images.component';
import { AsignateimageService } from '@app/secure/products/create-product-unit/assign-images/assign-images.component.service';
import { ImageUrlComponent } from '@app/secure/products/create-product-unit/assign-images/image-url/image-url.component';
import { CompoImagesComponent } from '@app/secure/products/create-product-unit/assign-images/compo-images/compo-images.component';
import { SpecificationProductComponent } from './specifications/specification.component';
import { SpecificationDialogComponent } from './specifications/dialog/dialog.component';
import { BasicInformationService } from './basic-information/basic-information.component.service';
import { SaveProcessDialogComponent } from './component-process/dialogSave/dialogSave.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    UnitProductRoutingModule,
    MaterialModule,
    FormsModule,
    ColorPickerModule
  ],
  declarations: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent,
    ValidateEanComponent,
    SearchCategorizationComponent,
    ListCategorizationComponent,
    TreeComponent,
    ProductBasicInfoComponent,
    AssignImagesComponent,
    ImageUrlComponent,
    CompoImagesComponent,
    SpecificationProductComponent,
    SpecificationDialogComponent,
    SaveProcessDialogComponent
  ],
  exports: [
    CreateUnutaryProductComponent,
    ComponentProcessComponent,
    ValidateEanComponent,
    SearchCategorizationComponent,
    ListCategorizationComponent,
    TreeComponent,
    ProductBasicInfoComponent,
    AssignImagesComponent,
    ImageUrlComponent,
    CompoImagesComponent,
    SpecificationProductComponent,
    SpecificationDialogComponent,
    SaveProcessDialogComponent
  ],
  entryComponents: [
    SpecificationDialogComponent,
    SaveProcessDialogComponent
  ],
  providers: [
    SearchService,
    SpecificationService,
    ProcessService,
    AsignateimageService,
    BasicInformationService,
  ]
})
export class UnitProductModule {
}
