/* 3rd party components */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* our own custom components */
import { ProfileComponent } from './profile-page/profile.component';

const routes: Routes = [
    {
        path: 'perfil',
        component: ProfileComponent,
        data: { title: "Perfil" }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})

export class ProfileRoutingModule { }
