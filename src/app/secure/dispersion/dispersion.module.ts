import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispersionRoutingModule } from './dispersion.routing';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { DetailPaymentComponent } from './detail-payment/detail-payment.component';
import { HistoricalPaymentComponent } from './detail-payment/historical-payment/historical-payment.component';
import { NewsCollectedComponent } from './detail-payment/news-collected/news-collected.component';
import { FinishUploadInformationComponent } from '../load-guide-page/finish-upload-information/finish-upload-information.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    DispersionRoutingModule
  ],
  declarations: [
    PaymentSummaryComponent,
    DetailPaymentComponent,
    HistoricalPaymentComponent,
    NewsCollectedComponent
  ],
    entryComponents: [
      FinishUploadInformationComponent
  ],
})
export class DispersionModule { }
