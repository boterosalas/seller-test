import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { DetailComponent } from './detail-page/detail.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterShipmentsExito}envio/:id`,
      component: DetailComponent,
      data: { title: 'Detalles del envío' },
    }
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DetailRoutingModule {
}
