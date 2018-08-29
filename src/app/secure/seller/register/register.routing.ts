import { Routes, RouterModule } from '@angular/router';
import { RegisterSellerComponent } from './register.component';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../../shared';

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterSellers}`,
        component: RegisterSellerComponent,
    },
    {
        path: `${RoutesConst.sellerCenterIntSellerRegister}`,
        component: RegisterSellerComponent,
        data: { title: 'Registrar vendedor' },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class RegisterRoutingModule { }
