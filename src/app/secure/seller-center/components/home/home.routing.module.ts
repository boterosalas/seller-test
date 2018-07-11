/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* our own custom components */
import {HomeComponent} from './home.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: HomeComponent,
    data: {title: 'Todas las ordenes'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {
}
