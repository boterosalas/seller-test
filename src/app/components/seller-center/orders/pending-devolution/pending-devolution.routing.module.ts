
/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';

const base = 'seller-center/';

const routes: Routes = [

    {
        path: `${base}ordenes/solicitudes-pendientes`,
        component: PendingDevolutionComponent,
        data: { title: 'Solicitudes pendientes' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class PendingDevolutionRoutingModule { }
