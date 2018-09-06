import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { PendingComponent } from './pending-page/pending.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntShipmentsExitoPending}`,
      component: PendingComponent,
      data: { title: 'Histórico de mis pedidos' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class PendingRoutinModule {
}
