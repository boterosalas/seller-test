import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { SpecificationsParamComponent } from './specifications/specifications.component';
import { BrandsComponent } from './brands/brands.component';
import { RoutesConst } from './../../shared';
import { AuthService } from '../auth/auth.routing';
import { CategoryTreeComponent } from './category-tree/category-tree.component';

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterIntParamSpecs}`,
      component: SpecificationsParamComponent,
      data: { title: 'Especificaciones' },
      canActivate: [AuthService]
    }, {
      path: `${RoutesConst.sellerCenterIntParamBrand}`,
      component: BrandsComponent,
      data: { title: 'Marcas' },
    },
    {
      path: `${RoutesConst.sellerCenterIntCategoryTree}`,
      component: CategoryTreeComponent,
      canActivate: [AuthService],
      data: {title: 'Categorias'}
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
