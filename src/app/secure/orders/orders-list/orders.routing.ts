import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { OrdersListComponent } from './orders-page/orders-list.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.secureSeller}`,
      redirectTo: `/${RoutesConst.sellerCenterOrders}`,
      pathMatch: 'full',
    },
    {
      path: `${RoutesConst.sellerCenterOrders}`,
      component: OrdersListComponent,
      data: { title: 'Todas las órdenes' },
    },
    {
      path: `${RoutesConst.sellerCenterIntOrdersState}/:category`,
      component: OrdersListComponent,
      data: { title: 'Órdenes' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class OrdersRoutingModule {
}
