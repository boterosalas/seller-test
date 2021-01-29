import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from '@app/shared';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ListSchoolExitoComponent } from './list-school-exito/list-school-exito.component';

const routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntSchoolExito}`,
      component: ListSchoolExitoComponent,
      data: { title: 'Escuela Éxito' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SchoolExitoRoutingModule {
  
}
