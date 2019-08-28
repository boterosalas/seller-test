import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ReportOffertComponent } from './report-offert/report-offert.component';
import { RoutesConst } from '@app/shared';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOfferReportOffert}`,
      component: ReportOffertComponent,
      data: { title: 'Reporte de ofertas' },
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

export class ListReportRoutingModule {
}
