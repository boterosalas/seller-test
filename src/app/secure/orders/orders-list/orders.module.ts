/* 3rd party components */
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


/* our own custom components */
import { ClientInformationModule } from '../../client-information/client-information.module';
import { OrdersListComponent } from './orders-page/orders-list.component';
import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { ProductsOrderComponent } from './products-order/products-order.component';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';
import { SendOrderComponent } from './send-order/send-order.component';
import { FormProductComponent } from './send-order/form-product/form-product.component';
import { OrderService } from './orders.service';
import { MaterialModule } from '../../material-components';
import {
    UserService,
    EventEmitterOrders,
    ComponentsService } from '@app/shared';
    import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { CdkDetailRowDirectiveModule } from '../../directives/cdk-detail-row/cdk-detail-row.module';
import { ConfirmAlertComponent } from '../../confirm-alert/confirm-alert.component';
import { OrdersRoutingModule } from './orders.routing';


/**
 * Módulo de órdenes
 */
@NgModule({
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        ToolbarLinkModule,
        ToolbarOptionsModule,
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
        UserService,
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
