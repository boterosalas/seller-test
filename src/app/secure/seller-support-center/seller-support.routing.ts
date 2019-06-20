import { Routes, RouterModule } from "@angular/router";
import { Route } from "@app/core";
import { NgModule } from "@angular/core";

import { RoutesConst } from "@app/shared";

import { AuthService } from "../auth/auth.routing";

import { ListOfCaseComponent } from "./list-of-case/list-of-case.component";

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterCases}`,
      component: ListOfCaseComponent,
      data: { title: "Administrar Casos" },
      //canActivate: [AuthService]
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class SellerSupportRoutingModule {}
