import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';

import { NoWhitespaceDirective } from '../../directives/no-spaces/no-whitespace.directive';
import { CitiesComponent } from './cities/cities.component';
import { RegisterSellerComponent } from './register.component';
import { RegisterRoutingModule } from './register.routing';
import { RegisterService } from './register.service';
import { StatesComponent } from './states/states.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule,
    RegisterRoutingModule
  ],
  declarations: [
    RegisterSellerComponent,
    StatesComponent,
    CitiesComponent,
    NoWhitespaceDirective
  ],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: ShowOnDirtyErrorStateMatcher
    },
    RegisterService
  ]
})
export class RegisterModule {

}

