import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { InValidationComponent } from './in-validation-page/in-validation.component';

const isProductionEnv = environment.production;

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterIntOrderInValidation}`,
    component: !isProductionEnv ? InValidationComponent : ErrorPageComponent,
    data: {title: 'En validación'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InValidationRoutingModule {
}
