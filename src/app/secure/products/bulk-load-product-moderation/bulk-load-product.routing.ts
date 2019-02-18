import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation/bulk-load-product-moderation.component';
import { AuthService } from '@app/secure/auth/auth.routing';


const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterProductModerationBulkLoad}`,
      component: BulkLoadProductModerationComponent,
      data: { title: 'Moderación de productos' },
      canActivate: [AuthService]
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
