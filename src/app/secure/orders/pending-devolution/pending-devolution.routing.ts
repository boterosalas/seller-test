import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';

const isProductionEnv = environment.production;

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntOrderInPendingDevolution}`,
        component: !isProductionEnv ? PendingDevolutionComponent : ErrorPageComponent,
        data: { title: 'Solicitudes pendientes' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class PendingDevolutionRoutingModule { }
