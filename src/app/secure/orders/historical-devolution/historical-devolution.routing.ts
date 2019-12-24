import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from '@app/shared';
import { HistoricalDevolutionComponent } from './historical-devolution-page/historical-devolution.component';
import { AuthService } from '@app/secure/auth/auth.routing';

const routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderHistoricalDevolution}`,
      component: HistoricalDevolutionComponent,
      data: { title: 'Historico de devoluciones' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
  providers: []
})
export class HistoricalDevolutionRoutingModule {}
