import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ListComponent } from './list/list.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
    path: `${RoutesConst.sellerCenterIntOfersList}`,
    component: ListComponent,
    data: {title: 'Listado de Ofertas'},
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListRoutingModule {}
