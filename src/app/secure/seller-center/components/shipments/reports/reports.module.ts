// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Local components
import { ReportsComponent } from './reports-page/reports.component';
import { ReportRoutingModule } from './reports.routing';
import { ToolbarLinkModule } from '../../../../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../../../../shared/toolbar-options/toolbar-options.module';
import {ShipmentsService} from '../shipments.service';
import { MaterialModule } from '../../material-components';
import { UserService } from '../../../utils/services/common/user/user.service';

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
