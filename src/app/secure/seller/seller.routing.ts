import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { NgModule } from '@angular/core';
import { SellerListComponent } from './list/list-sellers.component';
import { RoutesConst } from '@app/shared';
import { AuthService } from '../auth/auth.routing';
import { UploadAgreementComponent } from './upload-agreement/upload-agreement.component';
import { ManageAgreementComponent } from './manage-agreement/manage-agreement.component';

const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntSellerList}`,
            component:  SellerListComponent,
            data: { title: 'Administrar vendedores' },
            canActivate: [AuthService]
        },
        {
            path: `${RoutesConst.sellerCenterIntUploadAgreement}`,
            component:  UploadAgreementComponent,
            data: { title: 'Cargar acuerdos' },
            canActivate: [AuthService]
        },
        {
            path: `${RoutesConst.sellerCenterIntManageAgreement}`,
            component:  ManageAgreementComponent,
            data: { title: 'Administrar acuerdos' },
            canActivate: [AuthService]
        }
    ])
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class SellerRoutingModule { }
