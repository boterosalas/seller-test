import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { BulkLoadComponent } from './bulk-load/bulk-load.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterOffers}`,
      component: BulkLoadComponent,
      data: { title: 'Cargar masiva de Ofertas' },
    },
    {
      path: `${RoutesConst.sellerCenterIntOferBulkLoad}`,
      component: BulkLoadComponent,
      data: { title: 'Cargar masiva de Ofertas' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BulkLoadRoutingModule {
}
