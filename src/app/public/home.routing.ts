import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../shared';
import { RegistrationConfirmationComponent } from './auth/confirm/confirmRegistration.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './auth/forgot/forgotPassword.component';
import { LoginComponent } from './auth/login/login.component';
import { NewPasswordComponent } from './auth/newpassword/newpassword.component';
import { RegisterComponent } from './auth/register/registration.component';
import { ResendCodeComponent } from './auth/resend/resendCode.component';
import { AboutComponent, HomeComponent } from './home.component';

// Define si la app esta en un entorno de producción.
const isProductionEnv = environment.production;

const routes: Routes = [
  {
    path: '',
    redirectTo: `/${RoutesConst.home}`,
    pathMatch: 'full'
  },
  {
    path: `${RoutesConst.home}`,
    component: HomeComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: `${RoutesConst.login}`, component: LoginComponent },
      { path: 'about', component: AboutComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'confirmRegistration/:username', component: RegistrationConfirmationComponent },
      { path: 'resendCode', component: ResendCodeComponent },
      { path: 'forgotPassword/:email', component: ForgotPassword2Component },
      { path: 'forgotPassword', component: ForgotPasswordStep1Component },
      { path: 'newPassword', component: NewPasswordComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class HomeRoutingModule { }
