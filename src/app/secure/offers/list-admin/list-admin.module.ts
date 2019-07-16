// 3rd party components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MaterialModule } from '@app/material.module';

// our own custom components
import { SharedModule } from '@shared/shared.module';
import { ListAdminComponent } from '@app/secure/offers/list-admin/list-admin/list-admin.component';
import { ListAdminRoutingModule } from './list-admin.routing';



@NgModule({
  imports: [
    SharedModule,
    BrowserModule,
    CommonModule,
    ListAdminRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule,
    MaterialModule,
  ],
  declarations: [
    ListAdminComponent
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    DatePipe
  ]
})
export class ListAdminModule {}
