
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchedComponent } from './dispatched-page/dispatched.component';
import { RoutesConst } from './../../../shared';
// local components

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterIntShipmentsExitoOffice}`,
        component: DispatchedComponent,
        data: { title: 'Envíos en despacho' },
    }
];

/**
 *
 *
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class DispatchRoutingModule { }
