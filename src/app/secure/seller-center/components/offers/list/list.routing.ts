import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ListComponent } from './list/list.component';

const base = 'seller-center/';

const routes: Routes = [
  {
    path: `${base}ofertas/listado-ofertas`,
    component: ListComponent,
    data: {title: 'Listado de Ofertas'}
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListRoutingModule {}
