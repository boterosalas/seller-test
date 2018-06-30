/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
// import { LoginComponent } from './login-page/login.component';
import { LoginComponent } from '../../aws-cognito/public/auth/login/login.component';
import { RecoveryComponent } from './recovery-page/recovery.component';

const routes: Routes = [
    {
        path: 'ingresar',
        component: LoginComponent,
        data: { title: 'Iniciar sesión | Seller Center ' }
    },
    {
        path: 'token/:token',
        component: LoginComponent,
        data: { title: 'Iniciar sesión' }
    },

    {
        path: 'recuperar-contraseña',
        component: RecoveryComponent,
        data: { title: 'Recuperar contraseña' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class LoginRoutingModule { }
