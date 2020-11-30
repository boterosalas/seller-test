import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispersionRoutingModule } from './dispersion.routing';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    DispersionRoutingModule
  ],
  declarations: [PaymentSummaryComponent]
})
export class DispersionModule { }
