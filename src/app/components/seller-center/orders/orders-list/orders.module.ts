/* 3rd party components */
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


/* our own custom components */
import { MaterialModule } from '../../../../core/components/material-components';
import { ToolbarLinkModule } from '../../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../../shared/toolbar-options/toolbar-options.module';
import { ClientInformationModule } from '../../client-information/client-information.module';
import { OrdersRoutingModule } from './orders.routing.module';
import { CdkDetailRowDirectiveModule } from '../../../common/cdk-detail-row/cdk-detail-row.module';
import { ConfirmAlertComponent } from '../../../../core/components/confirm-alert/confirm-alert.component';
import { OrdersListComponent } from './orders-page/orders-list.component';
import { OrderDetailModalComponent } from './order-detail-modal/order-detail-modal.component';
import { ProductsOrderComponent } from './products-order/products-order.component';
import { ProductDetailModalComponent } from './product-detail-modal/product-detail-modal.component';
import { SendOrderComponent } from './send-order/send-order.component';
import { FormProductComponent } from './send-order/form-product/form-product.component';
import { UserService } from '../../../../core/services/common/user/user.service';
import { OrderService } from './orders.service';
import { EventEmitterOrders } from '../../../../core/event/eventEmitter-orders.service';
import { ComponentsService } from '../../../../core/services/common/components/components.service';


/**
 * Módulo de ordenes
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
        OrdersRoutingModule,
        CdkDetailRowDirectiveModule
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
        ProductDetailModalComponent,
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
