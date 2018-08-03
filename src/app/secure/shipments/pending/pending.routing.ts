
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingComponent } from './pending-page/pending.component';
import { RoutesConst } from './../../../shared';
// local components

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntShipmentsExitoPending}`,
        component: PendingComponent,
        data: { title: 'Histórico de mis pedidos' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class PendingRoutinModule { }
