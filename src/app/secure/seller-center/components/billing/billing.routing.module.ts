/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* our own custom components */
import {BillingComponent} from './billing-page/billing.component';

const base = 'seller-center/';

const routes: Routes = [

  {
    path: `${base}facturacion/pagos`,
    component: BillingComponent,
    data: {title: 'Facturación'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BillingRoutingModule {
}
