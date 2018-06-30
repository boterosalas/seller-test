import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {UserRegistrationService} from './service/user-registration.service';
import {UserParametersService} from './service/user-parameters.service';
import {UserLoginService} from './service/user-login.service';
import {CognitoUtil} from './service/cognito.service';
import {routing} from './aws-cognito.routes';
import {AboutComponent, HomeComponent, HomeLandingComponent} from './public/home.component';
import {AwsUtil} from './service/aws.service';
import {UseractivityComponent} from './secure/useractivity/useractivity.component';
import {MyProfileComponent} from './secure/profile/myprofile.component';
import {SecureHomeComponent} from './secure/landing/securehome.component';
import {JwtComponent} from './secure/jwttokens/jwt.component';
import {DynamoDBService} from './service/ddb.service';
import {LoginComponent} from './public/auth/login/login.component';
import {RegisterComponent} from './public/auth/register/registration.component';
import {ForgotPassword2Component, ForgotPasswordStep1Component} from './public/auth/forgot/forgotPassword.component';
import {LogoutComponent, RegistrationConfirmationComponent} from './public/auth/confirm/confirmRegistration.component';
import {ResendCodeComponent} from './public/auth/resend/resendCode.component';
import {NewPasswordComponent} from './public/auth/newpassword/newpassword.component';
import { MFAComponent } from './public/auth/mfa/mfa.component';
// import login exito
import { ReactiveFormsModule } from '@angular/forms';
/* our own custom components */
import { MaterialModule } from '../../core/components/material-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AwsCognitoComponent } from '.';

@NgModule({
    declarations: [
        NewPasswordComponent,
        LoginComponent,
        LogoutComponent,
        RegistrationConfirmationComponent,
        ResendCodeComponent,
        ForgotPasswordStep1Component,
        ForgotPassword2Component,
        RegisterComponent,
        MFAComponent,
        AboutComponent,
        HomeLandingComponent,
        HomeComponent,
        UseractivityComponent,
        MyProfileComponent,
        SecureHomeComponent,
        JwtComponent,
        AwsCognitoComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        routing,
        // imports login exito
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        DynamoDBService,
        UserRegistrationService,
        UserLoginService,
        UserParametersService]
})
export class AwsCognitoModule {
}
