import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { QuotingAdministratorComponent } from './quoting-administrator.component';
import { ShippingMethodsModule } from './shipping-methods/shipping-methods.module';
import { ListTransporterModule } from './list-transporter/list-transporter.module';
import { ListZonesModule } from './list-zones/list-zones.module';
import { EventEmitterDialogs } from './events/eventEmitter-dialogs.service';

@NgModule({
  declarations: [
    QuotingAdministratorComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ShippingMethodsModule,
    ListTransporterModule,
    ListZonesModule
  ],
  exports: [
    QuotingAdministratorComponent
  ],
  providers: [
    EventEmitterDialogs
  ],
})
export class QuotingAdministratorModule { }
