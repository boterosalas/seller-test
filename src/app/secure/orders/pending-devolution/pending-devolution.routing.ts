import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderInPendingDevolution}`,
      component: PendingDevolutionComponent,
      data: { title: 'Solicitudes pendientes' }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PendingDevolutionRoutingModule {
}
