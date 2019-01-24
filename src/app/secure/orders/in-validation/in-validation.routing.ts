import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { InValidationComponent } from './in-validation-page/in-validation.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';

const isProductionEnv = environment.production;



const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderInValidation}`,
      component: !isProductionEnv ? InValidationComponent : ErrorPageComponent,
      data: { title: 'En validación' },
        canActivate: [TermsService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InValidationRoutingModule {
}
