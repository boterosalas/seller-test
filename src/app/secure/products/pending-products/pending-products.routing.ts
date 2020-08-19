import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { PendingProductsComponent } from './pending-products.component';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntPendingProducts}`,
      component: PendingProductsComponent,
      data: { title: 'Productos pendientes' },
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

export class PendingProductsRoutingModule {
}
