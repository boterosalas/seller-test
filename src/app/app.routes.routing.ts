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
import { ErrorPageComponent } from './secure/seller-center/components/error-page/error-page.component';
import { OrdersListComponent } from './secure/seller-center/components/orders/orders-list/orders-page/orders-list.component';
import { RegisterSellerComponent } from './secure/seller-center/components/seller/register/register.component';
import { Const } from './shared/util/constants';

const homeRoutes: Routes = [
    {
        path: '',
        redirectTo: `/${Const.home}`,
        pathMatch: 'full'
    },
    {
        path: `${Const.home}`,
        component: HomeComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'login', component: LoginComponent },
            { path: 'about', component: AboutComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'confirmRegistration/:username', component: RegistrationConfirmationComponent },
            { path: 'resendCode', component: ResendCodeComponent },
            { path: 'forgotPassword/:email', component: ForgotPassword2Component },
            { path: 'forgotPassword', component: ForgotPasswordStep1Component },
            { path: 'newPassword', component: NewPasswordComponent }
        ]
    },
    {
        path: `${Const.securehome}`,
        component: SecureHomeComponent,
        children: [
            { path: '', component: OrdersListComponent },
            { path: `${Const.seller}`, component: OrdersListComponent },
            { path: 'logout', component: LogoutComponent },
            { path: 'jwttokens', component: JwtComponent },
            { path: 'myprofile', component: MyProfileComponent },
            { path: 'useractivity', component: UseractivityComponent }
        ]
    },
    {
        path: `${Const.sellerCenterUrls.orders}`,
        component: OrdersListComponent,
        children: [
            { path: '', component: OrdersListComponent }
        ]
    },
    {
        path: `${Const.sellerCenterUrls.sellers}`,
        component: RegisterSellerComponent,
        children: [
            { path: '', component: RegisterSellerComponent }
        ]
    }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(homeRoutes);

export class AppRoutingModule { }
