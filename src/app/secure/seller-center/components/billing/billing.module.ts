/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';


/* our own custom components */
import {BillingRoutingModule} from './billing.routing.module';
import {BillingService} from './billing.service';
import {BillingComponent} from './billing-page/billing.component';
import {BillingProductsOrderComponent} from './billing-products-order/billing-products-order.component';
import {OrderBillingDetailModalComponent} from './order-detail-modal/order-detail-modal.component';
import {ProductDetailBillingModalComponent} from './product-detail-modal/product-detail-modal.component';
import { ToolbarOptionsModule } from '../../../../shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from '../../../../shared/toolbar-link/toolbar-link.module';
import { CdkDetailRowDirectiveModule } from '../../directives/cdk-detail-row/cdk-detail-row.module';
import { MaterialModule } from '../material-components';
import { EndpointService } from '../../utils/http/endpoint.service';
import { UserService } from '../../utils/services/common/user/user.service';
import { ComponentsService } from '../../utils/services/common/components/components.service';
import { ShellComponent } from '../../shell/shell.component';
import { EventEmitterOrders } from '../../utils/event/eventEmitter-orders.service';
import { HttpErrorHandlingService } from '../../utils/http/http-error-handling.service';

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
    ProductDetailBillingModalComponent
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
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}

  ]
})
export class BillingModule {
}
