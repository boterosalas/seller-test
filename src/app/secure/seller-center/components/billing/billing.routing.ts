import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Local
import { RoutesConst } from '../../../../shared/util/routes.constants';
import { BillingComponent } from './billing-page/billing.component';


const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterBilling}`,
    component: BillingComponent,
    data: { title: 'Facturación' }
  },
  {
    path: `${RoutesConst.sellerCenterIntBillingPayments}`,
    component: BillingComponent,
    data: { title: 'Facturación' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BillingRoutingModule {
}
