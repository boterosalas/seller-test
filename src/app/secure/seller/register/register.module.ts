import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterSellerComponent } from './register.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { StatesComponent } from './states/states.component';
import { RegisterService } from './register.service';
import { CitiesComponent } from './cities/cities.component';
import { NoWhitespaceDirective } from '../../directives/no-spaces/no-whitespace.directive';
import { MaterialModule } from '../../../material.module';
import { RegisterRoutingModule } from './register.routing';

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

