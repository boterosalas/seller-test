import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerSupportRoutingModule } from './seller-support.routing';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';

import { ListOfCaseComponent } from './list-of-case/list-of-case.component';
import { SharedModule } from '@app/shared/shared.module';
import { DetailCaseComponent } from './detail-case/detail-case.component';
import { SellerSupportCenterService } from './services/seller-support-center.service';
import { CaseSupportCenterService } from './services/case-support-center.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalExportToReclaimComponent } from './modal-export-to-reclaim/modal-export-to-reclaim.component';

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
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ListOfCaseComponent, DetailCaseComponent, ModalExportToReclaimComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [SellerSupportCenterService, CaseSupportCenterService],
  entryComponents: [
    ModalExportToReclaimComponent
  ]
})
export class SellerSupportCenterModule {}
