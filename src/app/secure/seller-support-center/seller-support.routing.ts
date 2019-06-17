import { Routes, RouterModule } from "@angular/router";
import { Route } from "@app/core";
import { NgModule } from "@angular/core";

import { RoutesConst } from "@app/shared";

import { AuthService } from "../auth/auth.routing";

import { TicketComponentComponent } from "./ticket-component/ticket-component.component";

const routes: Routes = [
  Route.withShell([
    {
      path: `${RoutesConst.sellerCenterTickets}`,
      component: TicketComponentComponent,
      data: { title: "Administrar Tickets" }
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
