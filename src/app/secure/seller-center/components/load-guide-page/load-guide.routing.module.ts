/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

/* our own custom components */
import {LoadGuidePageComponent} from './load-guide/load-guide-page.component';

const base = 'seller-center/';

const routes: Routes = [
  {
    path: `${base}cargar-guia`,
    component: LoadGuidePageComponent,
    data: {title: 'Cargar de guías'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoadGuideRoutingModule {
}
