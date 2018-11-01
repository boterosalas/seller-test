import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { SpecificationsParamComponent } from './specifications/specifications.component';

import { RoutesConst } from './../../shared';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntParamSpecs}`,
      component: SpecificationsParamComponent,
      data: { title: 'Especificaciones' },
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ParameterizeRouting {
}
