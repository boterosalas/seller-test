import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../shared';
import { BillingComponent } from './billing-page/billing.component';

const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterBilling}`,
      component: !isProductionEnv ? BillingComponent : ErrorPageComponent,
      data: { title: 'Facturación' },
    },
    {
      path: `${RoutesConst.sellerCenterIntBillingPayments}`,
      component: !isProductionEnv ? BillingComponent : ErrorPageComponent,
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
