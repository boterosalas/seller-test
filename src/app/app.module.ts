import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { UserRegistrationService } from './service/user-registration.service';
import { UserParametersService } from './service/user-parameters.service';
import { UserLoginService } from './service/user-login.service';
import { CognitoUtil } from './service/cognito.service';
import { routing } from './app.routes.routing';
import { AboutComponent, HomeComponent, HomeLandingComponent } from './public/home.component';
import { AwsUtil } from './service/aws.service';
import { UseractivityComponent } from './secure/useractivity/useractivity.component';
import { MyProfileComponent } from './secure/profile/myprofile.component';
import { SecureHomeComponent } from './secure/landing/securehome.component';
import { JwtComponent } from './secure/jwttokens/jwt.component';
import { DynamoDBService } from './service/ddb.service';
import { LoginComponent } from './public/auth/login/login.component';
import { RegisterComponent } from './public/auth/register/registration.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './public/auth/forgot/forgotPassword.component';
import { LogoutComponent, RegistrationConfirmationComponent } from './public/auth/confirm/confirmRegistration.component';
import { ResendCodeComponent } from './public/auth/resend/resendCode.component';
import { NewPasswordComponent } from './public/auth/newpassword/newpassword.component';
import { MFAComponent } from './public/auth/mfa/mfa.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LOCALE_ID } from '@angular/core';

/* our own custom components */
import { MaterialModule } from './secure/seller-center/components/material-components';
import { AppComponent } from '.';
import { environment } from './environments/environment';
import { ShellModule } from './secure/seller-center/shell/shell.module';
import { HomeModule } from './secure/seller-center/components/home/home.module';
import { ErrroModule } from './secure/seller-center/components/error-page/error-page.module';
import { LoadGuideModule } from './secure/seller-center/components/load-guide-page/load-guide.module';
import { OrdersModule } from './secure/seller-center/components/orders/orders-list/orders.module';
import { InValidationModule } from './secure/seller-center/components/orders/in-validation/in-validation.module';
import { PendingDevolutionModule } from './secure/seller-center/components/orders/pending-devolution/pending-devolution.module';
import { InDevolutionModule } from './secure/seller-center/components/orders/in-devolution/id-devolution.module';
import { ToolbarOptionsModule } from './shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from './shared/toolbar-link/toolbar-link.module';
import { BillingModule } from './secure/seller-center/components/billing/billing.module';
import { RegisterModule } from './secure/seller-center/components/seller/register/register.module';
import { PendingModule } from './secure/seller-center/components/shipments/pending/pending.module';
import { StoresModule } from './secure/seller-center/components/offers/stores/stores.module';
import { HistoricModule } from './secure/seller-center/components/shipments/historic/historic.module';
import { DispatchModule } from './secure/seller-center/components/shipments/dispatched/dispatched.module';
import { DetailModule } from './secure/seller-center/components/shipments/detail/detail.module';
import { BulkLoadModule } from './secure/seller-center/components/offers/bulk-load/bulk-load.module';
import { ListModule } from './secure/seller-center/components/offers/list/list.module';

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
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        FormsModule,
        HttpModule,
        HttpClientModule,
        routing,
        // imports login exito
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        ShellModule,
        HomeModule,
        ErrroModule,
        LoadGuideModule,
        OrdersModule,
        InValidationModule,
        PendingDevolutionModule,
        InDevolutionModule,
        ToolbarOptionsModule,
        ToolbarLinkModule,
        BillingModule,
        RegisterModule,
        PendingModule,
        StoresModule,
        HistoricModule,
        DispatchModule,
        DetailModule,
        BulkLoadModule,
        ListModule
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        DynamoDBService,
        UserRegistrationService,
        UserLoginService,
        UserParametersService,
        MyProfileComponent,
        { provide: LOCALE_ID, useValue: 'es-CO' }],
        bootstrap: [AppComponent]
})
export class AppModule {
}
