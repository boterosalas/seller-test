
/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntOrderInPendingDevolution}`,
        component: PendingDevolutionComponent,
        data: { title: 'Solicitudes pendientes' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class PendingDevolutionRoutingModule { }