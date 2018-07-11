// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Local components
import { HistoricComponent } from './historic-page/historic.component';
import { HistoricRoutingModule } from './historic.routing.module';
import {ShipmentsService} from '../shipments.service';
import { MaterialModule } from '../../material-components';
import { ToolbarLinkModule } from '../../../../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../../../../shared/toolbar-options/toolbar-options.module';
import { UserService } from '../../../utils/services/common/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ToolbarLinkModule,
    HistoricRoutingModule,
    ToolbarOptionsModule
  ],
  declarations: [
    HistoricComponent
  ],
  exports: [
    HistoricComponent
  ],
  providers: [
    ShipmentsService,
    UserService
  ]
})

export class HistoricModule { }
