import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { DispatchedComponent } from './dispatched-page/dispatched.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntShipmentsExitoOffice}`,
      component: DispatchedComponent,
      data: { title: 'Envíos en despacho' },
    }
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DispatchRoutingModule {
}
