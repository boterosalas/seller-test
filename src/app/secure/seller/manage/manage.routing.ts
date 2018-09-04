import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntSellerManage}`,
            component: ManageComponent,
            data: { title: 'Administrar vendedor' },
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ManageRoutingModule { }
