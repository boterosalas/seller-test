/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

/* our own custom components */
import {ClientInformationComponent} from './client-information.component';
import {MaterialModule} from '../../../core/components/material-components';

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
