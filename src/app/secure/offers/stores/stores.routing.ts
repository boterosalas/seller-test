import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { StoreComponent } from './store/store.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOferTreeCategory}`,
      component: StoreComponent,
      data: { title: 'Arbol de categorías' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class StoresRoutingModule {
}
