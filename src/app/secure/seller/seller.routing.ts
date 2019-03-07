import { Routes, RouterModule } from '@angular/router';
import { Route } from '@app/core';
import { NgModule } from '@angular/core';
import { SellerListComponent } from './list/list-sellers.component';
import { RoutesConst } from '@app/shared';
import { AuthService } from '../auth/auth.routing';

const routes: Routes = [
    Route.withShell([
        {
            path: `${RoutesConst.sellerCenterIntSellerList}`,
            component:  SellerListComponent,
            data: { title: 'Administrar vendedores' },
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
