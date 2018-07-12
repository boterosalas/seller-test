/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { OrdersListComponent } from './orders-page/orders-list.component';

const base = 'securehome/seller-center/';

const routes: Routes = [
    {
        path: `${base}`,
        component: OrdersListComponent,
        data: { title: 'Todas las ordenes' }
    },
    {
        path: `${base}ordenes`,
        component: OrdersListComponent,
        data: { title: 'Todas las ordenes' }
    },
    {
        path: `${base}ordenes/estado/:category`,
        component: OrdersListComponent,
        data: { title: 'Ordenes' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class OrdersRoutingModule { }
