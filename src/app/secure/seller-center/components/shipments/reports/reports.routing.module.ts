
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports-page/reports.component';

// local components

const base = 'envios-exito/';

const routes: Routes = [{
    path: `${base}reportes`,
    component: ReportsComponent,
    data: { title: 'Reportes de mis envíos' }
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ReportRoutingModule { }
