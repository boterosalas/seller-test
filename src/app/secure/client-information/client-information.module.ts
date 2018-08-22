import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';

import { ClientInformationComponent } from './client-information.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
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
