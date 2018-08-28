import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../shared';
import { BillingComponent } from './billing-page/billing.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterBilling}`,
      component: BillingComponent,
      data: { title: 'Facturación' },
    },
    {
      path: `${RoutesConst.sellerCenterIntBillingPayments}`,
      component: BillingComponent,
      data: { title: 'Facturación' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BillingRoutingModule {
}
