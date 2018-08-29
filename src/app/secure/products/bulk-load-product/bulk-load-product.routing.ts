import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BulkLoadProductComponent} from './bulk-load-product/bulk-load-product.component';
import { RoutesConst } from './../../../shared';
import { environment } from '@env/environment';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';

const isProductionEnv = environment.production;
const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterProducts}`,
    component: !isProductionEnv ? BulkLoadProductComponent :  ErrorPageComponent,
    data: {title: 'Cargar masiva de Producto'},
  },
  {
    path: `${RoutesConst.sellerCenterIntProductBulkLoad}`,
    component: !isProductionEnv ? BulkLoadProductComponent :  ErrorPageComponent,
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
