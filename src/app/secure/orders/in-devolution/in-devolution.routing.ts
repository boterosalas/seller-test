import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';

const isProductionEnv = environment.production;


const routes: Routes = [
  Route.withShell([
    {
        path: `${RoutesConst.sellerCenterIntOrderInDevolution}`,
        component: InDevolutionComponent,
        data: { title: 'En devolución' },
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
export class BillingRoutingModule {
}
