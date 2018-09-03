import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntSellerManage}`,
        component: ManageComponent,
        data: { title: 'Administrar vendedor' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ManageRoutingModule { }
