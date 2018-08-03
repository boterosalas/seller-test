import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutesConst } from './shared';
import { HomeComponent } from './public/home.component';
import { ErrorPageComponent } from './secure/error-page/error-page.component';


const appRoutes: Routes =
  [
    { path: `${RoutesConst.error}`, component: ErrorPageComponent },
    { path: `${RoutesConst.home}`, component: HomeComponent },
    {
      path: '**',
      redirectTo: `${RoutesConst.error}`,
    }
  ];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
