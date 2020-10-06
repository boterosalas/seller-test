import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReportOffertComponent } from './report-offert/report-offert.component';
import { RoutesConst } from '@app/shared';
import { ReportErrorsVtexComponent } from './report-errors-vtex/report-errors-vtex.component';

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
