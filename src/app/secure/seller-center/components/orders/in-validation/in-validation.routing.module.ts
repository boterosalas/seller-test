/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* our own custom components */
import {InValidationComponent} from './in-validation-page/in-validation.component';

const base = 'securehome/seller-center/';

const routes: Routes = [

  {
    path: `${base}ordenes/en-validacion`,
    component: InValidationComponent,
    data: {title: 'En validación'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class InValidationRoutingModule {
}
