import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CognitoUtil } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';

import { BillingFulfillmentDetailComponent } from './billing-fulfillment-detail/billing-fulfillment-detail.component';
import { BillingComponent } from './billing-page/billing.component';
import { BillingProductsOrderComponent } from './billing-products-order/billing-products-order.component';
import { BillingRoutingModule } from './billing.routing';
import { BillingService } from './billing.service';
import { OrderBillingDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { ProductDetailBillingModalComponent } from './product-detail-modal/product-detail-modal.component';
import { DownloadBillingpayModalComponent } from './download-billingpay-modal/download-billingpay-modal.component';
import { ToolbarOptionsModule } from '@app/shared/components';
import { SummaryPaymentsComponent } from './summary-payments/summary-payments.component';
import { FilterSummaryPaymentComponent } from './filter-summary-payment/filter-summary-payment.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BillingRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSortModule,
  ],
  declarations: [
    BillingComponent,
    BillingProductsOrderComponent,
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent,
    BillingFulfillmentDetailComponent,
    DownloadBillingpayModalComponent,
    SummaryPaymentsComponent,
    FilterSummaryPaymentComponent
  ],
  exports: [
    BillingComponent,
    BillingProductsOrderComponent,
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent,
    DownloadBillingpayModalComponent
  ],
  entryComponents: [
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent,
    DownloadBillingpayModalComponent
  ],
  providers: [
    BillingService,
    ComponentsService,
    ShellComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    CognitoUtil
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class BillingModule {
}
