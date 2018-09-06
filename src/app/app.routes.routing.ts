import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from '@secure/error-page/error-page.component';
import { RoutesConst } from './shared';


const appRoutes: Routes =
  [
    {
      path: '**',
      redirectTo: `/${RoutesConst.error}`,
    },
    { path: `${RoutesConst.error}`, component: ErrorPageComponent }
  ];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
