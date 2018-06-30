// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Local components
import { ReportsComponent } from './reports-page/reports.component';
import { MaterialModule } from '../../../core/components/material-components';
import { ReportRoutingModule } from './reports.routing.module';
import { ToolbarLinkModule } from '../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../shared/toolbar-options/toolbar-options.module';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
import {ShipmentsService} from '../shipments.service';
import {UserService} from '../../../core/services/common/user/user.service';

@NgModule({
  imports: [
      CommonModule,
      MaterialModule,
      ReportRoutingModule,
      ToolbarLinkModule,
      ToolbarOptionsModule,
      // NgxChartsModule
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
