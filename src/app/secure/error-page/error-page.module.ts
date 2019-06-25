import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { ErrorPageComponent } from './error-page.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    RouterModule,
    HttpClientModule,
    SharedModule,
    CommonModule
  ],
  declarations: [
    ErrorPageComponent,
  ],
  providers: []
})

export class ErrorModule {
}
