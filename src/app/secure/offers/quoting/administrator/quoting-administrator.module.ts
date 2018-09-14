import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotingAdministratorComponent } from './quoting-administrator.component';
import { ShippingMethodsModule } from './shipping-methods/shipping-methods.module';

@NgModule({
  declarations: [
    QuotingAdministratorComponent
  ],
  imports: [
    CommonModule,
    ShippingMethodsModule
  ],
  exports: [
    QuotingAdministratorComponent
  ],
  providers: [],
})
export class QuotingAdministratorModule { }
