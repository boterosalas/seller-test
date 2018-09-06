import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
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


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BillingRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  declarations: [
    BillingComponent,
    BillingProductsOrderComponent,
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent,
    BillingFulfillmentDetailComponent
  ],
  exports: [
    BillingComponent,
    BillingProductsOrderComponent,
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent
  ],
  entryComponents: [
    OrderBillingDetailModalComponent,
    ProductDetailBillingModalComponent
  ],
  providers: [
    BillingService,
    ComponentsService,
    ShellComponent,
    EventEmitterOrders,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    CognitoUtil
  ]
})
export class BillingModule {
}
