
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingComponent } from './pending-page/pending.component';

// local components

const base = 'envios-exito/';

const routes: Routes = [
    {
        path: `${base}pendientes`,
        component: PendingComponent,
        data: { title: 'Histórico de mis pedidos' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class PendingRoutinModule { }
