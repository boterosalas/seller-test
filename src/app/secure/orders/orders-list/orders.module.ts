import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '@app/material.module';
import {ComponentsService, ConfirmAlertComponent, EventEmitterOrders} from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';

import { ClientInformationModule } from '../../client-information/client-information.module';
import { CdkDetailRowDirectiveModule } from '../../directives/cdk-detail-row/cdk-detail-row.module';
import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { OrdersListComponent } from './orders-page/orders-list.component';
import { OrdersRoutingModule } from './orders.routing';
import { OrderService } from './orders.service';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';
import { ProductsOrderComponent } from './products-order/products-order.component';
import { FormProductComponent } from './send-order/form-product/form-product.component';
import { SendOrderComponent } from './send-order/send-order.component';


@NgModule({
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        ClientInformationModule,
        CdkDetailRowDirectiveModule,
        OrdersRoutingModule
    ],
    declarations: [
        ConfirmAlertComponent,
        OrdersListComponent,
        OrderDetailModalComponent,
        ProductDetailModalComponent,
        ProductsOrderComponent,
        SendOrderComponent,
        FormProductComponent
    ],
    entryComponents: [
        ConfirmAlertComponent,
        SendOrderComponent,
        OrderDetailModalComponent,
        ProductDetailModalComponent
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
        FormProductComponent
    ]
})
export class OrdersModule { }
