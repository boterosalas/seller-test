import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { LogoutComponent } from '@public/auth/confirm/confirmRegistration.component';
import { RoutesConst } from './../../shared';
import { JwtComponent } from './jwttokens/jwt.component';
import { SecureHomeComponent } from './landing/securehome.component';
import { MyProfileComponent } from './profile/myprofile.component';
import { UseractivityComponent } from './useractivity/useractivity.component';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { TermsService } from '../seller/agreement/terms/terms.component.service';
import { AuthService } from '../auth/auth.routing';

const routes: Routes = [
  Route.withShell([
    {
      path: ``,
      redirectTo: `/${RoutesConst.securehome}`,
      pathMatch: 'full'
    },
    {
      path: `${RoutesConst.securehome}`,
      component: SecureHomeComponent,
      children: [
        { path: '', component: DashboardComponent,
        canActivate: [AuthService] },
        {
          path: `${RoutesConst.logout}`, component: LogoutComponent,
          canActivate: [AuthService]
        },
        { path: `${RoutesConst.jwttokens}`, component: JwtComponent },
        { path: `${RoutesConst.myProfile}`, component: MyProfileComponent },
        { path: `${RoutesConst.useractivity}`, component: UseractivityComponent },
        {
          path: `${RoutesConst.seller}`, component: DashboardComponent
        }
      ],
      canActivate: [TermsService]
    }
  ])
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class AwsCognitoRoutingModule {
}
