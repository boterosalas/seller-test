import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { ListAdminComponent } from './list-admin/list-admin.component';
import { AuthService } from '@app/secure/auth/auth.routing';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOfersListAdmin}`,
      component: ListAdminComponent,
      data: { title: 'Listado de Ofertas' },
      canActivate: [AuthService]
    }
  ])
];

/**
 *
 * @export
 * @class ListAdminRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ListAdminRoutingModule {
}
