import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { BillingOrderComponent } from './billing-orders.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';

// const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderBillingOrders}`,
      component: BillingOrderComponent,
      data: { title: 'Factura electrónica' },
      canActivate: [TermsService]
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BillingOrdersRoutingModule {
}
