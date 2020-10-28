import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';

import { RoutesConst } from './../../../shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ListCancelsOrdersComponent } from './list-cancels-orders.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterListCancelOrders}`,
      component: ListCancelsOrdersComponent,
      data: { title: 'Listado de cancelaciones' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ListCancelOrderRoutingModule {
}
