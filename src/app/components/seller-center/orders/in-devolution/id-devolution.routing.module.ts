/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';

const base = 'seller-center/';

const routes: Routes = [
    {
        path: `${base}ordenes/en-devolucion`,
        component: InDevolutionComponent,
        data: { title: 'En devolución' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class BillingRoutingModule { }
