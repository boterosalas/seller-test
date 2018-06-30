import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent} from './register.component';
import { MaterialModule } from '../../../../core/components/material-components';
import { RegisterRoutingModule } from './register.routing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { StatesComponent } from './states/states.component';
import { RegisterService } from './register.service';
import { CitiesComponent } from './cities/cities.component';

import { NoWhitespaceDirective } from './../../../../directives/no-spaces/no-whitespace.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RegisterRoutingModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule
  ],
  declarations: [
    RegisterComponent,
    StatesComponent,
    CitiesComponent,
    NoWhitespaceDirective
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    RegisterService
  ]
})
export class RegisterModule {

}

