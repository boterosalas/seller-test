/* 3rd party components */
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
/* our own custom components */
import { HistoryComponent } from './history/history.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
    path: `${RoutesConst.sellerCenterIntOferHistoryBulkLoad}`,
    component: HistoryComponent,
    data: {title: 'Histórico de Carga de Ofertas'},
  }
];

/**
 *
 * @export
 * @class HistoryRoutingModule
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HistoryRoutingModule {}
