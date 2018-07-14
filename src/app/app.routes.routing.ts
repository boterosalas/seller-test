import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AboutComponent, HomeComponent, HomeLandingComponent } from './public/home.component';
import { SecureHomeComponent } from './secure/landing/securehome.component';
import { MyProfileComponent } from './secure/profile/myprofile.component';
import { JwtComponent } from './secure/jwttokens/jwt.component';
import { UseractivityComponent } from './secure/useractivity/useractivity.component';
import { LoginComponent } from './public/auth/login/login.component';
import { RegisterComponent } from './public/auth/register/registration.component';
import { ForgotPassword2Component, ForgotPasswordStep1Component } from './public/auth/forgot/forgotPassword.component';
import { LogoutComponent, RegistrationConfirmationComponent } from './public/auth/confirm/confirmRegistration.component';
import { ResendCodeComponent } from './public/auth/resend/resendCode.component';
import { NewPasswordComponent } from './public/auth/newpassword/newpassword.component';
import { OrdersListComponent } from './secure/seller-center/components/orders/orders-list/orders-page/orders-list.component';
import { RoutesConst } from './shared/util/routes.constants';
import { ErrorPageComponent } from './secure/seller-center/components/error-page/error-page.component';

const homeRoutes: Routes = [
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

const secureHomeRoutes: Routes = [
    {

        path: '',
        redirectTo: `${RoutesConst.securehome}`,
        pathMatch: 'full'
    },
    {
        path: `${RoutesConst.securehome}`,
        component: SecureHomeComponent,
        children: [
            { path: `${RoutesConst.logout}`, component: LogoutComponent },
            { path: `${RoutesConst.jwttokens}`, component: JwtComponent },
            { path: `${RoutesConst.myProfile}`, component: MyProfileComponent },
            { path: `${RoutesConst.useractivity}`, component: UseractivityComponent },
            { path: `${RoutesConst.seller}`, component: OrdersListComponent },
            { path: '', component: SecureHomeComponent }]
    }
];

const routes: Routes = [
    {
        path: '',
        children: [
            ...homeRoutes,
            ...secureHomeRoutes,
            {
                path: '',
                component: HomeComponent
            }
        ]
    },
    { path: '**', component: ErrorPageComponent }


];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

export class AppRoutingModule { }
