import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReportOffertComponent } from './report-offert/report-offert.component';
import { RoutesConst } from '@app/shared';
import { ReportErrorsVtexComponent } from './report-errors-vtex/report-errors-vtex.component';
import { ReportCommissionComponent } from './report-commission/report-commission.component';
import { ReportDispersionComponent } from './report-dispersion/report-dispersion.component';
import { FraudNotificationComponent } from './fraud-notification/fraud-notification.component';
import { SellerContactsComponent } from './seller-contacts/seller-contacts.component';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOfferReportOffert}`,
      component: ReportOffertComponent,
      data: { title: 'Reporte de ofertas' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntReportsErrorsVtex}`,
      component: ReportErrorsVtexComponent,
      data: { title: 'Reporte de errores en VTEX' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntReportsCommission}`,
      component: ReportCommissionComponent,
      data: { title: 'Reporte de comisiones' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntReportsDispersion}`,
      component: ReportDispersionComponent,
      data: { title: 'Reporte cobros pendientes MPI' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterFraudNotification}`,
      component: FraudNotificationComponent,
      data: { title: 'Notificación de Fraudes' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterSellerContact}`,
      component: SellerContactsComponent,
      data: { title: 'Contactos vendedor' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ListReportRoutingModule {
}
