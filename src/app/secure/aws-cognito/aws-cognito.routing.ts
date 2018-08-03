import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RoutesConst } from './../../shared';

import { LogoutComponent } from '@public/auth/confirm/confirmRegistration.component';
import { OrdersListComponent } from '../orders/orders-list/orders-page/orders-list.component';
import { SecureHomeComponent } from './landing/securehome.component';
import { JwtComponent } from './jwttokens/jwt.component';
import { MyProfileComponent } from './profile/myprofile.component';
import { UseractivityComponent } from './useractivity/useractivity.component';

const routes: Routes = [
    {

        path: '',
        redirectTo: `${RoutesConst.securehome}`,
        pathMatch: 'full'
    },
    {
        path: `${RoutesConst.securehome}`,
        component: SecureHomeComponent,
        children: [
            { path: `${RoutesConst.logout}`, component: LogoutComponent },
            { path: `${RoutesConst.jwttokens}`, component: JwtComponent },
            { path: `${RoutesConst.myProfile}`, component: MyProfileComponent },
            { path: `${RoutesConst.useractivity}`, component: UseractivityComponent },
            { path: `${RoutesConst.seller}`, component: OrdersListComponent },
            { path: '', component: OrdersListComponent }]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class AwsCognitoRoutingModule { }
