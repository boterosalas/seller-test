import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispersionRoutingModule } from './dispersion.routing';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';

@NgModule({
  imports: [
    CommonModule,
    DispersionRoutingModule
  ],
  declarations: [PaymentSummaryComponent]
})
export class DispersionModule { }
