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
import { ModalResultLoadExceptionComponent } from './exception/modal-result-load-exception/modal-result-load-exception.component';
import { DownloadSpecsComponent } from './specifications/download-specs/download-specs.component';
import { DownloadCategoriesComponent } from './category/categories/download-categories/download-categories.component';
import { ModalBulkloadBrandsComponent } from './brands/modal-bulkload-brands/modal-bulkload-brands.component';
import { SizesComponent } from './sizes/sizes.component';
import { SizesService } from './sizes/sizes.service';
import { NotificationAdminComponent } from './notification-admin/notification-admin.component';
import { NotificationFormComponent } from './notification-admin/component/notification-form/notification-form.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { UploadFileMasiveComponent } from '@app/shared/components/upload-file-masive/upload-file-masive.component';
import { ModalLoadFileComponent } from './notification-admin/component/modal-load-file/modal-load-file.component';
import { ModalPreviewNotificationComponent } from './notification-admin/component/modal-preview-notification/modal-preview-notification.component';
import { ModalGenericComponent } from './notification-admin/component/modal-generic/modal-generic.component';

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
    ExceptionBrandComponent,
    ModalResultLoadExceptionComponent,
    DownloadSpecsComponent,
    DownloadCategoriesComponent,
    ModalBulkloadBrandsComponent,
    SizesComponent,
    NotificationAdminComponent,
    NotificationFormComponent,
    UploadFileMasiveComponent,
    ModalLoadFileComponent,
    ModalPreviewNotificationComponent,
    ModalGenericComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ParameterizeRouting,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    AngularEditorModule,
    ColorPickerModule
  ],
  exports: [
    CategoryTreeComponent
  ],
  providers: [
    ParamSpecsService,
    BrandService,
    SizesService,
    CategoryTreeService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  entryComponents: [
    AddDialogComponent,
    AddDialogSpecsComponent,
    DeleteDialogSpecsComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    ModalPortComponent,
    ModalResultLoadExceptionComponent,
    DownloadSpecsComponent,
    DownloadCategoriesComponent,
    ModalBulkloadBrandsComponent,
    UploadFileMasiveComponent,
    ModalLoadFileComponent,
    ModalPreviewNotificationComponent,
    ModalGenericComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ParameterizeModule { }
