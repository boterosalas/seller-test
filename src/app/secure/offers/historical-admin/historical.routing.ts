// 3rd party components
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// our own custom components
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { HistoricalAdminComponent } from '@app/secure/offers/historical-admin/historical-admin/historicalAdmin.component';
import { AuthService } from '@app/secure/auth/auth.routing';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOferHistoricalBulkLoadAdmin}`,
      component: HistoricalAdminComponent,
      data: { title: 'Histórico de Carga de Ofertas' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HistoricalRoutingModule { }
