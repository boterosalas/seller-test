import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterizeRouting } from './parameterize.routing';
import { SpecificationsParamComponent, FocusDirective } from './specifications/specifications.component';
import { SharedModule } from '@app/shared/shared.module';
import { ParamSpecsService } from './specifications/specifications.component.service';
import { AddDialogComponent } from './dialog/dialog-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrandsComponent } from './brands/brands.component';
import { BrandService } from './brands/brands.component.service';
import { AddDialogSpecsComponent } from './dialogAddSpecs/dialog-add-specs.component';
import { DeleteDialogSpecsComponent } from './dialogDelete/dialog-delete.component';
import { CategoriesComponent } from './category/categories/categories.component';
import { CategoryTreeComponent } from './category/category-tree/category-tree.component';
import { CategoryTreeService } from './category/category-tree.service';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { CreateProcessDialogComponent } from '../../shared/components/create-process-dialog/create-process-dialog.component';
import { PortComponent } from './port/port.component';
import { ModalPortComponent } from './port/modal-port/modal-port.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ExceptionComponent } from './exception/exception.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { ExceptionBrandComponent } from '../offers/stores/tree/components/exception-brand/exception-brand.component';
import { StoresModule } from '../offers';

@NgModule({
  declarations: [
    SpecificationsParamComponent,
    AddDialogComponent,
    BrandsComponent,
    FocusDirective,
    AddDialogSpecsComponent,
    DeleteDialogSpecsComponent,
    CategoriesComponent,
    CategoryTreeComponent,
    PortComponent,
    ModalPortComponent,
    ExceptionComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParameterizeRouting,
    ReactiveFormsModule,
    FormsModule,
    StoresModule,
    CurrencyMaskModule
  ],
  exports: [
    CategoryTreeComponent
  ],
  providers: [
    ParamSpecsService,
    BrandService,
    CategoryTreeService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  entryComponents: [
    AddDialogComponent,
    AddDialogSpecsComponent,
    DeleteDialogSpecsComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    ModalPortComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ParameterizeModule { }
