// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Local components
import { ReportsComponent } from './reports-page/reports.component';
import { ReportRoutingModule } from './reports.routing';
import { UserService } from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import {ShipmentsService} from '../shipments.service';
import { MaterialModule } from '../../material-components';

@NgModule({
  imports: [
      CommonModule,
      MaterialModule,
      ReportRoutingModule,
      ToolbarLinkModule,
      ToolbarOptionsModule
  ],
  declarations: [
    ReportsComponent
  ],
  exports: [
    ReportsComponent
  ],
  providers: [
    UserService,
    ShipmentsService
  ]
})

export class ReportsModule { }
