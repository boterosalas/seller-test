/* 3rd party components */
import { RouterModule, Routes } from '@angular/router';
import {ModuleWithProviders, NgModule} from '@angular/core';

/* our own custom components */
import { ErrorPageComponent } from './components/common/error-page/error-page.component';
import { HomeComponent } from './components/seller-center/home/home.component';
/* aws-cognito components */
import { LoginComponent } from './components/aws-cognito/public/auth/login/login.component';
import { SecureHomeComponent } from './components/aws-cognito/secure/landing/securehome.component';
import { MyProfileComponent } from './components/aws-cognito/secure/profile/myprofile.component';
import { LogoutComponent } from './components/aws-cognito/public/auth/confirm/confirmRegistration.component';

const homeRoutes: Routes = [
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
  },
  { path: 'error', component: ErrorPageComponent },
  {
      path: 'home',
      component: HomeComponent,
      children: [
          {path: 'about', component: HomeComponent},
          {path: 'login', component: LoginComponent},
          {path: 'confirmRegistration/:username', component: HomeComponent},
          {path: 'resendCode', component: HomeComponent},
          {path: 'forgotPassword/:email', component: HomeComponent},
          {path: 'forgotPassword', component: HomeComponent},
          {path: 'newPassword', component: HomeComponent},
          {path: '', component: HomeComponent}
      ]
  },
];

const secureHomeRoutes: Routes = [
  {

      path: '',
      redirectTo: '/securehome',
      pathMatch: 'full'
  },
  {
      path: 'securehome', component: SecureHomeComponent, children: [
      {path: 'logout', component: LogoutComponent},
      {path: 'jwttokens', component: HomeComponent},
      {path: 'myprofile', component: HomeComponent},
      {path: 'useractivity', component: HomeComponent},
      {path: '', component: MyProfileComponent}]
  }
];
// Creación de las rutas base de la app
const appRoutes: Routes =
  [
    { path: 'error', component: ErrorPageComponent },
    { path: 'home', component: HomeComponent },
    {
      path: '**',
      redirectTo: 'error',
    }
  ];

const routes: Routes = [
  {
      path: '',
      children: [
          ...homeRoutes,
          ...secureHomeRoutes,
          ...appRoutes,
          {
              path: '',
              component: HomeComponent
          }
      ]
  },


];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})

export class AppRoutingModule { }
