import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { NgModule } from '@angular/core';

const base = 'seller-center/';
const routes: Routes = [
  {
    path: `${base}vendedores/registrar`,
    component: RegisterComponent,
    data: { title: 'Registrar vendedor' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class RegisterRoutingModule {}
