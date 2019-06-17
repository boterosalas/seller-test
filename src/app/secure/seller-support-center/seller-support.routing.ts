import { Routes, RouterModule } from "@angular/router";
import { Route } from "@app/core";
import { NgModule } from "@angular/core";

import { RoutesConst } from "@app/shared";

import { AuthService } from "../auth/auth.routing";

import { CaseComponentComponent } from "./case-component/case-component.component";

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterCases}`,
      component: CaseComponentComponent,
      data: { title: "Administrar Cases" }
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
