import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../../shared';
import { environment } from '@env/environment';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';

const isProductionEnv = environment.production;
const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntSellerManage}`,
            component: !isProductionEnv ? ManageComponent : ErrorPageComponent,
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
