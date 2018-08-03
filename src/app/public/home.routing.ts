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
