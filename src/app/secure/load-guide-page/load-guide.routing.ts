import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Route } from '@app/core';
import { RoutesConst } from './../../shared';
import { LoadGuidePageComponent } from './load-guide/load-guide-page.component';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntOrderLoadGuide}`,
      component: LoadGuidePageComponent,
      data: { title: 'Cargar de guías' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class LoadGuideRoutingModule {
}
