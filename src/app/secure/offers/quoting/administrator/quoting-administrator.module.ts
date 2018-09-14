import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotingAdministratorComponent } from './quoting-administrator.component';
import { ShippingMethodsModule } from './shipping-methods/shipping-methods.module';
import { ListTransporterModule } from './list-transporter/list-transporter.module';

@NgModule({
  declarations: [
    QuotingAdministratorComponent
  ],
  imports: [
    CommonModule,
    ShippingMethodsModule,
    ListTransporterModule
  ],
  exports: [
    QuotingAdministratorComponent
  ],
  providers: [],
})
export class QuotingAdministratorModule { }
