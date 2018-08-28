import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';


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
