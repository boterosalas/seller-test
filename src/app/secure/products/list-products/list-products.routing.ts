import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { ListProductsComponent } from './list-products.component';
import { AuthService } from '@app/secure/auth/auth.routing';
import { TabProductComponent } from './tab-product/tab-product.component';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntListProducts}`,
      component: TabProductComponent,
      data: { title: 'Listado de productos' },
      // canActivate: [TermsService]
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ListProductRoutingModule {
}
