/* 3rd party components */
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
/* our own custom components */
import { ListComponent } from './list/list.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
    path: `${RoutesConst.sellerCenterIntOfersList}`,
    component: ListComponent,
    data: {title: 'Listado de Ofertas'},
  }
];

/**
 *
 * @export
 * @class ListRoutingModule
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ListRoutingModule {}
