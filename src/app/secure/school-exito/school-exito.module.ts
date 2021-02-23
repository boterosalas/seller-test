import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSchoolExitoComponent } from './list-school-exito/list-school-exito.component';
import { SchoolExitoRoutingModule } from './school-exito.routing';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolExitoService } from './school-exito.service';
import { ListSellerSchoolComponent } from './list-school-exito/list-seller-school/list-seller-school.component';
import { ListAdminSchoolComponent } from './list-school-exito/list-admin-school/list-admin-school.component';
import { EditModuleComponent } from './list-school-exito/components/edit-module/edit-module.component';
import { CreateModuleComponent } from './list-school-exito/components/create-module/create-module.component';
import { CreateSubmoduleComponent } from './list-school-exito/components/create-submodule/create-submodule.component';
import { DeleteItemModuleComponent } from './list-school-exito/components/delete-item-module/delete-item-module.component';
import { DeleteModuleComponent } from './list-school-exito/components/delete-module/delete-module.component';
import { EditItemModuleComponent } from './list-school-exito/components/edit-item-module/edit-item-module.component';
import { UploadFileComponent } from './list-school-exito/components/upload-file/upload-file.component';

@NgModule({
  imports: [
    CommonModule,
    SchoolExitoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    EditModuleComponent,
    DeleteModuleComponent,
    EditItemModuleComponent,
    DeleteItemModuleComponent,
    CreateSubmoduleComponent,
    CreateModuleComponent,
  ],
  declarations: [
    ListSchoolExitoComponent,
    ListSellerSchoolComponent,
    ListAdminSchoolComponent,
    EditModuleComponent,
    DeleteModuleComponent,
    EditItemModuleComponent,
    DeleteItemModuleComponent,
    CreateSubmoduleComponent,
    CreateModuleComponent,
    UploadFileComponent
  ],
  providers: [SchoolExitoService],
})
export class SchoolExitoModule { }
