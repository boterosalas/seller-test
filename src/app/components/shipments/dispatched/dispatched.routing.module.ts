
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispatchedComponent } from './dispatched-page/dispatched.component';

// local components

const base = "envios-exito/";

const routes: Routes = [{
    path: `${base}despacho`,
    component: DispatchedComponent,
    data: { title: "Envíos en despacho" }
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
