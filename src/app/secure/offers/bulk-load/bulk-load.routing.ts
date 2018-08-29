import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BulkLoadComponent} from './bulk-load/bulk-load.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterOffers}`,
    component: BulkLoadComponent,
    data: {title: 'Cargar masiva de Ofertas'},
  },
  {
    path: `${RoutesConst.sellerCenterIntOferBulkLoad}`,
    component: BulkLoadComponent,
    data: {title: 'Cargar masiva de Ofertas'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BulkLoadRoutingModule {
}
