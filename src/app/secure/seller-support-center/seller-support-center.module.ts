import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SellerSupportRoutingModule } from "./seller-support.routing";
import { LayoutModule } from "@angular/cdk/layout";
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from "@angular/material";

import { ListOfCaseComponent } from "./list-of-case/list-of-case.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    SellerSupportRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    SharedModule
  ],
  declarations: [ListOfCaseComponent]
})
export class SellerSupportCenterModule {}
