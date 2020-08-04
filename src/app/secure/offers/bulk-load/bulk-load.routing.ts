import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { BulkLoadComponent } from './bulk-load/bulk-load.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterOffers}`,
      component: BulkLoadComponent,
      data: { title: 'Cargar masiva de Ofertas' },
      // canActivate: [TermsService]
      canActivate: [AuthService]
    },
    {

      path: `${RoutesConst.sellerCenterIntOferBulkLoad}`,
      component: BulkLoadComponent,
      data: { title: 'Cargar masiva de Ofertas' },
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
export class BulkLoadRoutingModule {
}
