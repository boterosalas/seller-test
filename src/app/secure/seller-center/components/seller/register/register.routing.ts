import { Routes, RouterModule } from '@angular/router';
import { RegisterSellerComponent } from './register.component';
import { NgModule } from '@angular/core';

const base = 'securehome/seller-center/';
const routes: Routes = [
    {
        path: `${base}vendedores`,
        component: RegisterSellerComponent
    },
    {
        path: `${base}vendedores/registrar`,
        component: RegisterSellerComponent,
        data: { title: 'Registrar vendedor' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class RegisterRoutingModule { }
