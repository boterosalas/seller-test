/* 3rd party components */
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { RoutesConst } from '../../../../shared/util/routes.constants';
/* our own custom components */
import {LoadGuidePageComponent} from './load-guide/load-guide-page.component';

const routes: Routes = [
  {
    path: `${RoutesConst.sellerCenterIntOrderLoadGuide}`,
    component: LoadGuidePageComponent,
    data: {title: 'Cargar de guías'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoadGuideRoutingModule {
}
