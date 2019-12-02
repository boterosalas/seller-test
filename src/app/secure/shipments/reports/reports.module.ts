import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { ReportsComponent } from './reports-page/reports.component';
import { ReportRoutingModule } from './reports.routing';
import { ToolbarOptionsModule } from '@app/shared/components';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      ReportRoutingModule,
      ToolbarOptionsModule
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
