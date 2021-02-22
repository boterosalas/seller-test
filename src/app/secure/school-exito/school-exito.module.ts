import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSchoolExitoComponent } from './list-school-exito/list-school-exito.component';
import { SchoolExitoRoutingModule } from './school-exito.routing';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolExitoService } from './school-exito.service';
import { ListSellerSchoolComponent } from './list-school-exito/list-seller-school/list-seller-school.component';
import { ListAdminSchoolComponent } from './list-school-exito/list-admin-school/list-admin-school.component';

@NgModule({
  imports: [
    CommonModule,
    SchoolExitoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ListSchoolExitoComponent, ListSellerSchoolComponent, ListAdminSchoolComponent],
  providers: [SchoolExitoService],
})
export class SchoolExitoModule { }
