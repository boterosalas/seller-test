import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { ManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../../shared';
import { AgreementComponent } from '../agreement/agreement.component';
import { ProfileComponent } from '../profiles/profile.component';
import { AuthService } from '@app/secure/auth/auth.routing';

const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntSellerManage}`,
            component: ManageComponent ,
            data: { title: 'Administrar vendedor' },
            canActivate: [AuthService]
        }, {
            path: `${RoutesConst.sellerCenterIntSellerAgreements}`,
            component: AgreementComponent ,
            data: { title: 'Acuerdos del vendedor' },
        }, {
            path: `${RoutesConst.sellerCenterIntSellerProfiles}`,
            component: ProfileComponent,
            data: { title: 'Perfiles de usuario' },
            canActivate: [AuthService]
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ManageRoutingModule { }
