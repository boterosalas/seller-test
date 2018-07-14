import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreComponent } from './store/store.component';
import { RoutesConst } from '../../../../../shared/util/routes.constants';

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterUrlsInt.oferTreeCategory}`,
    component: StoreComponent,
    data: { title: 'Arbol de categorías' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class StoresRoutingModule { }
