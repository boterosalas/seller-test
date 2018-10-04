import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { CreateUnutaryProductComponent } from '@app/secure/products/create-product-unit/create-unutary-product/create-unutary-product.component';

const isProductionEnv = environment.production;
const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntCreateUnutaryProduct}`,
      component: CreateUnutaryProductComponent,
      data: { title: 'Creación Unitaria' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class UnitProductRoutingModule {
}
