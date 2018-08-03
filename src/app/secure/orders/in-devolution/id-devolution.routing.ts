/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntOrderInDevolution}`,
        component: InDevolutionComponent,
        data: { title: 'En devolución' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class BillingRoutingModule { }
