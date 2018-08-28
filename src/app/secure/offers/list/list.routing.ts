import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOfersList}`,
      component: ListComponent,
      data: { title: 'Listado de Ofertas' },
    }
  ])
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

export class ListRoutingModule {
}
