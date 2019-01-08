import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation/bulk-load-product-moderation.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';

const isProductionEnv = environment.production;

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterProductModerationBulkLoad}`,
      component: BulkLoadProductModerationComponent,
      data: { title: 'Moderación de productos' }
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
