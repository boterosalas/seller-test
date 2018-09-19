import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ClientInformationComponent } from './client-information.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ClientInformationComponent
  ],
  exports: [
    ClientInformationComponent
  ]
})
export class ClientInformationModule {
}
