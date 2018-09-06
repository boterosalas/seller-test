import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { ReportsComponent } from './reports-page/reports.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntShipmentsExitoReports}`,
      component: ReportsComponent,
      data: { title: 'Reportes de mis envíos' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ReportRoutingModule {
}
