// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// local components
import { HistoricComponent } from './historic-page/historic.component';

const base = 'envios-exito/';

const routes: Routes = [
    {
        path: `${base}historico`,
        component: HistoricComponent,
        data: { title: 'Historico' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class HistoricRoutingModule { }
