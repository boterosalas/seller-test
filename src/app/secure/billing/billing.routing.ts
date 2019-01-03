import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../shared';
import { BillingComponent } from './billing-page/billing.component';
import { TermsService } from '../seller/agreement/terms/terms.component.service';

const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterBilling}`,
      component: !isProductionEnv ? BillingComponent : ErrorPageComponent,
      data: { title: 'Facturación' },
      canActivate: [TermsService]
    },
    {
      path: `${RoutesConst.sellerCenterIntBillingPayments}`,
      component: !isProductionEnv ? BillingComponent : ErrorPageComponent,
      data: { title: 'Facturación' },
      canActivate: [TermsService]
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
