import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';

const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderInPendingDevolution}`,
      component: PendingDevolutionComponent,
      data: { title: 'Solicitudes pendientes' },
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
export class PendingDevolutionRoutingModule {
}
