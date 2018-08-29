
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports-page/reports.component';
import { RoutesConst } from './../../../shared';

// local components

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntShipmentsExitoReports}`,
        component: ReportsComponent,
        data: { title: 'Reportes de mis envíos' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ReportRoutingModule { }
