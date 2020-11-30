import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from '@app/shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { PaymentSummaryComponent } from './payment-summary/payment-summary.component';

const routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntDispersionSummary}`,
      component: PaymentSummaryComponent,
      data: { title: 'Resumen de pagos' },
      canActivate: [AuthService]
    }
  ])
];

console.log(RoutesConst.sellerCenterIntDispersionSummary);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DispersionRoutingModule {}
