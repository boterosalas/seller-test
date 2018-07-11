import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreComponent } from './store/store.component';

const base = 'seller-center/';
const routes: Routes = [
  {
    path: `${base}ofertas/arbol-categorias`,
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
