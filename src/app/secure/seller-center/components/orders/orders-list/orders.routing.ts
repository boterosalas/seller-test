/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { OrdersListComponent } from './orders-page/orders-list.component';
import { RoutesConst } from '../../../../../shared/util/routes.constants';

const routes: Routes = [
    {
        path: `${RoutesConst.secureSeller}`,
        component: OrdersListComponent,
        data: { title: 'Todas las órdenes' }
    },
    {
        path: `${RoutesConst.sellerCenterOrders}`,
        component: OrdersListComponent,
        data: { title: 'Todas las órdenes' }
    },
    {
        path: `${RoutesConst.sellerCenterIntOrdersState}/:category`,
        component: OrdersListComponent,
        data: { title: 'Órdenes' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class OrdersRoutingModule { }
