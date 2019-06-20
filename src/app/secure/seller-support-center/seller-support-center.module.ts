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

import { CaseComponentComponent } from "./case-component/case-component.component";
import { SharedModule } from "@app/shared/shared.module";
import { DetailCaseComponent } from "./detail-case/detail-case.component";

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
  declarations: [CaseComponentComponent, DetailCaseComponent]
})
export class SellerSupportCenterModule {}
