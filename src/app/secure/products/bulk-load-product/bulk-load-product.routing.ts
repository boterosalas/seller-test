import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { RoutesConst } from './../../../shared';
import { BulkLoadProductComponent } from './bulk-load-product/bulk-load-product.component';
import { AuthService } from '@app/secure/auth/auth.routing';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntProductBulkLoad}`,
      component: BulkLoadProductComponent,
      data: { title: 'Cargar masiva de Producto' },
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class BulkLoadProductRoutingModule {
}
