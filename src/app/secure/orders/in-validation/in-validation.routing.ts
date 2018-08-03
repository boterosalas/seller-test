/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* our own custom components */
import {InValidationComponent} from './in-validation-page/in-validation.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterIntOrderInValidation}`,
    component: InValidationComponent,
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
