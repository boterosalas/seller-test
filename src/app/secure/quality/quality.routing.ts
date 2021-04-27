import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from '@app/shared';
import { CalificationListComponent } from './calification-list/calification-list.component';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ConsultIndicatorsComponent } from './consult-indicators/consult-indicators.component';

const routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntListCalification}`,
      component: CalificationListComponent,
      data: { title: 'Calificación de vendedores' },
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntConsultIndicators}`,
      component: ConsultIndicatorsComponent,
      data: { title: 'Consultar Indicadores' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class QualityRoutingModule {
}
