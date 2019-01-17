import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { OrdersListComponent } from './orders-page/orders-list.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.secureSeller}`,
      redirectTo: `/${RoutesConst.sellerCenterIntDashboard}`,
      pathMatch: 'full',
    },
    {
      path: `${RoutesConst.sellerCenterOrders}`,
      component: OrdersListComponent,
      data: { title: 'Todas las órdenes' },
      canActivate: [TermsService]
    },
    {
      path: `${RoutesConst.sellerCenterIntOrdersState}/:category`,
      component: OrdersListComponent,
      data: { title: 'Órdenes' },
      canActivate: [TermsService]
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
