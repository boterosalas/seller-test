/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';


/* our own custom components */
import { BillingRoutingModule } from './billing.routing';
import { BillingService } from './billing.service';
import { BillingComponent } from './billing-page/billing.component';
import { BillingProductsOrderComponent } from './billing-products-order/billing-products-order.component';
import { OrderBillingDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { ProductDetailBillingModalComponent } from './product-detail-modal/product-detail-modal.component';
import {
  EndpointService,
  UserService,
  ComponentsService,
  EventEmitterOrders,
  HttpErrorHandlingService,
  CognitoUtil
} from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { CdkDetailRowDirectiveModule } from '../directives/cdk-detail-row/cdk-detail-row.module';
import { MaterialModule } from '../material-components';
import { ShellComponent } from '@core/shell/shell.component';
import { BillingFulfillmentDetailComponent } from './billing-fulfillment-detail/billing-fulfillment-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BillingRoutingModule,
    ToolbarOptionsModule,
    ToolbarLinkModule,
    CdkDetailRowDirectiveModule,
    MaterialModule,
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
    EndpointService,
    UserService,
    ComponentsService,
    ShellComponent,
    EventEmitterOrders,
    HttpErrorHandlingService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    CognitoUtil
  ]
})
export class BillingModule {
}
