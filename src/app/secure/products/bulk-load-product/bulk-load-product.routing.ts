import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';

const isProductionEnv = environment.production;
const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterProducts}`,
      component: BulkLoadProductComponent,
      data: { title: 'Cargar masiva de Producto' },
    },
    {
      path: `${RoutesConst.sellerCenterIntProductBulkLoad}`,
      component: BulkLoadProductComponent,
      data: { title: 'Cargar masiva de Producto' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BulkLoadProductRoutingModule {
}
