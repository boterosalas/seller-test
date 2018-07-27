// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// local components
import { HistoricComponent } from './historic-page/historic.component';
import { RoutesConst } from '../../../../../shared/util/routes.constants';


const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterShipmentsExito}`,
        component: HistoricComponent,
        data: { title: 'Historico' }
    },
    {
        path: `${RoutesConst.sellerCenterIntShipmentsExitoHist}`,
        component: HistoricComponent,
        data: { title: 'Historico' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class HistoricRoutingModule { }
