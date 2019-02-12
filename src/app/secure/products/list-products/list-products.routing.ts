import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { ListProductsComponent } from './list-products.component';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntListProducts}`,
      component: ListProductsComponent,
      data: { title: 'Listado de productos' },
      // canActivate: [TermsService]
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
