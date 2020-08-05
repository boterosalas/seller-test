import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';
import { BillingOrdersAdminComponent } from './billing-orders-admin.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderBillingOrdersAdmin}`,
      component: BillingOrdersAdminComponent,
      data: { title: 'Facturación vendedor' },
      canActivate: [TermsService, AuthService]
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BillingOrdersAdminRoutingModule {
}
