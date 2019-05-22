import { NgModule } from '@angular/core';
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
import { CreateProcessDialogComponent } from './category/create-process-dialog/create-process-dialog.component';

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
    CreateProcessDialogComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    ParameterizeRouting,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CategoryTreeComponent
  ],
  providers: [
    ParamSpecsService,
    BrandService,
    CategoryTreeService
  ],
  entryComponents: [
    AddDialogComponent,
    AddDialogSpecsComponent,
    DeleteDialogSpecsComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent
  ]
})
export class ParameterizeModule { }
