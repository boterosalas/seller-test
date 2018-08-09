import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BulkLoadProductComponent} from './bulk-load-product/bulk-load-product.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterProducts}`,
    component: BulkLoadProductComponent,
    data: {title: 'Cargar masiva de Producto'},
  },
  {
    path: `${RoutesConst.sellerCenterIntProductBulkLoad}`,
    component: BulkLoadProductComponent,
    data: {title: 'Cargar masiva de Producto'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BulkLoadProductRoutingModule {
}
