import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';
import { BulkLoadBillingComponent } from './bulk-load-billing.component';

// const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntBulkLoadBilling}`,
      component: BulkLoadBillingComponent,
      data: { title: 'Carga masiva de Facturas' },
      canActivate: [TermsService, AuthService]
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BulkLoadBillingRoutingModule {
}
