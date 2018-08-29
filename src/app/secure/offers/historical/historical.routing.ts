/* 3rd party components */
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
/* our own custom components */
import { HistoricalComponent } from './historical/historical.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
    path: `${RoutesConst.sellerCenterIntOferHistoricalBulkLoad}`,
    component: HistoricalComponent,
    data: {title: 'Histórico de Carga de Ofertas'},
  }
];

/**
 *
 * @export
 * @class HistoricalRoutingModule
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HistoricalRoutingModule {}
