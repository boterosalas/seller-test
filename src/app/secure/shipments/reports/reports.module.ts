import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared';

import { ShipmentsService } from '../shipments.service';
import { ReportsComponent } from './reports-page/reports.component';
import { ReportRoutingModule } from './reports.routing';

@NgModule({
  imports: [
      CommonModule,
      MaterialModule,
      SharedModule,
      ReportRoutingModule
  ],
  declarations: [
    ReportsComponent
  ],
  exports: [
    ReportsComponent
  ],
  providers: [
    ShipmentsService
  ]
})

export class ReportsModule { }
