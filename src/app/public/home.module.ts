import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';

import { LogoutComponent, RegistrationConfirmationComponent } from './auth/confirm/confirmRegistration.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './auth/forgot/forgotPassword.component';
import { LoginComponent } from './auth/login/login.component';
import { MFAComponent } from './auth/mfa/mfa.component';
import { NewPasswordComponent } from './auth/newpassword/newpassword.component';
import { RegisterComponent } from './auth/register/registration.component';
import { ResendCodeComponent } from './auth/resend/resendCode.component';
import { AboutComponent, HomeComponent, HomeLandingComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HomeRoutingModule
  ],
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
  exports: [],
  providers: []
})
export class HomeModule {
}
