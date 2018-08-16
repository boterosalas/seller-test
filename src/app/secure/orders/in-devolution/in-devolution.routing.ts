import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesConst } from '@app/shared';

import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';

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
