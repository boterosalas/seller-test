import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../shared';

import { HomeComponent, AboutComponent } from './home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/registration.component';
import { RegistrationConfirmationComponent } from './auth/confirm/confirmRegistration.component';
import { ResendCodeComponent } from './auth/resend/resendCode.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './auth/forgot/forgotPassword.component';
import { NewPasswordComponent } from './auth/newpassword/newpassword.component';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { GetTokenComponent } from './auth/token/token.component';
import { environment } from '@env/environment';

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
            { path: 'forgotPassword/:email', component: !isProductionEnv ? ForgotPassword2Component : ErrorPageComponent },
            { path: 'forgotPassword', component: !isProductionEnv ? ForgotPasswordStep1Component : ErrorPageComponent },
            { path: 'newPassword', component: NewPasswordComponent },
            { path: 'getToken/:email/:password', component: !isProductionEnv ? GetTokenComponent : ErrorPageComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class HomeRoutingModule { }
