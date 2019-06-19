import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentsService, ConfirmAlertComponent, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';

import { ClientInformationModule } from '../../client-information/client-information.module';
import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { OrdersListComponent } from './orders-page/orders-list.component';
import { OrdersRoutingModule } from './orders.routing';
import { OrderService } from './orders.service';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';
import { ProductsOrderComponent } from './products-order/products-order.component';
import { FormProductComponent } from './send-order/form-product/form-product.component';
import { SendOrderComponent } from './send-order/send-order.component';
import { LoadFileComponent } from '@app/shared/components/load-file/load-file';
import { MaterialModule } from '@app/material.module';
import { ngfModule } from 'angular-file';
import { ToolbarOptionsModule } from '@app/shared/components';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ClientInformationModule,
    OrdersRoutingModule,
    MaterialModule,
    ngfModule,
    ToolbarOptionsModule
  ],
  declarations: [
    ConfirmAlertComponent,
    OrdersListComponent,
    OrderDetailModalComponent,
    ProductDetailModalComponent,
    ProductsOrderComponent,
    SendOrderComponent,
    FormProductComponent,
    LoadFileComponent
  ],
  entryComponents: [
    ConfirmAlertComponent,
    SendOrderComponent,
    OrderDetailModalComponent,
    ProductDetailModalComponent,
    LoadFileComponent
  ],
  providers: [
    OrderService,
    EventEmitterOrders,
    ComponentsService,
    OrdersListComponent
  ],
  exports: [
    OrdersListComponent,
    OrderDetailModalComponent,
    ProductDetailModalComponent,
    ProductsOrderComponent,
    SendOrderComponent,
    FormProductComponent,
    LoadFileComponent
  ]
})
export class OrdersModule {
}
