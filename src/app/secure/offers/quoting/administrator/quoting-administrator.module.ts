import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotingAdministratorComponent } from './quoting-administrator.component';
import { ShippingMethodsModule } from './shipping-methods/shipping-methods.module';
import { ListTransporterModule } from './list-transporter/list-transporter.module';
import { ListZonesModule } from './list-zones/list-zones.module';

@NgModule({
  declarations: [
    QuotingAdministratorComponent
  ],
  imports: [
    CommonModule,
    ShippingMethodsModule,
    ListTransporterModule,
    ListZonesModule
  ],
  exports: [
    QuotingAdministratorComponent
  ],
  providers: [],
})
export class QuotingAdministratorModule { }
