import { Routes, RouterModule } from "@angular/router";
import { Route } from "@app/core";
import { NgModule } from "@angular/core";

import { RoutesConst } from "@app/shared";

import { AuthService } from "../auth/auth.routing";

import { CaseComponentComponent } from "./case-component/case-component.component";
import { DetailCaseComponent } from "./detail-case/detail-case.component";

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterCases}`,
      component: CaseComponentComponent,
      data: { title: "Administrar Casos" }
      // canActivate: [AuthService]
    },
    {
      path: `${RoutesConst.sellerCenterCasesDetail}`,
      component: DetailCaseComponent,
      data: { title: "Detalle Caso" }
      // canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SellerSupportRoutingModule {}
