import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';

import { HistoricComponent } from './historic-page/historic.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterShipmentsExito}`,
      component: HistoricComponent,
      data: { title: 'Historico' },
    },
    {
      path: `${RoutesConst.sellerCenterIntShipmentsExitoHist}`,
      component: HistoricComponent,
      data: { title: 'Historico' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class HistoricRoutingModule {
}
