
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail-page/detail.component';
import { RoutesConst } from './../../../shared';
// local components

const routes: Routes = [
    {
        path: `${RoutesConst.sellerCenterShipmentsExito}envio/:id`,
        component: DetailComponent,
        data: { title: 'Detalles del envío' },
    }
];

/**
 * @export
 * @class HomeRoutingModule
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class DetailRoutingModule { }