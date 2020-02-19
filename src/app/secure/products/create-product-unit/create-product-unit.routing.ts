import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { environment } from '@env/environment';

import { RoutesConst } from './../../../shared';
import { CreateUnutaryProductComponent } from '@app/secure/products/create-product-unit/create-unutary-product/create-unutary-product.component';
import { TermsService } from '@app/secure/seller/agreement/terms/terms.component.service';
import { AuthService } from '@app/secure/auth/auth.routing';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntCreateUnutaryProduct}`,
      component: CreateUnutaryProductComponent,
      data: { title: 'Creación Unitaria' },
      // canActivate: [TermsService]
      canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class UnitProductRoutingModule {
}
