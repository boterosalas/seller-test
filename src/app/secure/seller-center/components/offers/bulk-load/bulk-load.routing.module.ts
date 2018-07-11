import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {BulkLoadComponent} from './bulk-load/bulk-load.component';

const base = 'seller-center/';

const routes: Routes = [
  {
    path: `${base}ofertas/carga-masiva`,
    component: BulkLoadComponent,
    data: {title: 'Cargar masiva de Ofertas'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class BulkLoadRoutingModule {
}
