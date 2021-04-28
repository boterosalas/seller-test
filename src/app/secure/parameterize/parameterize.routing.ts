import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Route } from '@app/core';
import { SpecificationsParamComponent } from './specifications/specifications.component';
import { BrandsComponent } from './brands/brands.component';
import { RoutesConst } from './../../shared';
import { AuthService } from '../auth/auth.routing';
import { CategoriesComponent } from './category/categories/categories.component';
import { PortComponent } from './port/port.component';
import { ExceptionComponent } from './exception/exception.component';
import { NotificationAdminComponent } from './notification-admin/notification-admin.component';

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
      canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterIntCategoryTree}`,
      component: CategoriesComponent,
      canActivate: [AuthService],
      data: {title: 'Categorias'}
    },
    {
      path: `${RoutesConst.sellerCenterIntPort}`,
      component: PortComponent,
      canActivate: [AuthService],
      data: {title: 'Port'}
    },
    {
      path: `${RoutesConst.sellerCenterIntException}`,
      component: ExceptionComponent,
      canActivate: [AuthService],
      data: {title: 'Excepción por comisión'}
    },
    {
      path: `${RoutesConst.sellerCenterIntNotification}`,
      component: NotificationAdminComponent,
      canActivate: [AuthService],
      data: {title: 'Notificación'}
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
