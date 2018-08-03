import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@secure/material-components';
import { HomeRoutingModule } from './home.routing';

import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent, RegistrationConfirmationComponent } from './auth/confirm/confirmRegistration.component';
import { NewPasswordComponent } from './auth/newpassword/newpassword.component';
import { ResendCodeComponent } from './auth/resend/resendCode.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './auth/forgot/forgotPassword.component';
import { RegisterComponent } from './auth/register/registration.component';
import { MFAComponent } from './auth/mfa/mfa.component';
import { AboutComponent, HomeComponent, HomeLandingComponent } from './home.component';

@NgModule({
    declarations: [
        LoginComponent,
        LogoutComponent,
        RegistrationConfirmationComponent,
        NewPasswordComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPassword2Component,
        RegisterComponent,
        MFAComponent,
        AboutComponent,
        HomeLandingComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HomeRoutingModule
    ],
    exports: [],
    providers: [],
})
export class HomeModule { }
