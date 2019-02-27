import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { RegisterSellerComponent } from './register.component';
import { AuthService } from '@app/secure/auth/auth.routing';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterSellers}`,
      component: RegisterSellerComponent,
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntSellerRegister}`,
      component: RegisterSellerComponent,
      data: { title: 'Registrar vendedor' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RegisterRoutingModule {
}
