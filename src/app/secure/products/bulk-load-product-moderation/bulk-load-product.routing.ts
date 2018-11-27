import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { environment } from '@env/environment';
import { ErrorPageComponent } from '@app/secure/error-page/error-page.component';

import { RoutesConst } from './../../../shared';
import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation/bulk-load-product-moderation.component';

const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterProductModerationBulkLoad}`,
      component: !isProductionEnv ? BulkLoadProductModerationComponent : ErrorPageComponent,
      data: { title: 'Moderación de productos' },
    },
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BulkLoadProductModerationRoutingModule {
}
