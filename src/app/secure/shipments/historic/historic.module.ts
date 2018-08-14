// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Local components
import { HistoricComponent } from './historic-page/historic.component';
import { HistoricRoutingModule } from './historic.routing';
import {ShipmentsService} from '../shipments.service';
import { MaterialModule } from '../../../material.module';
import { UserService } from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';

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
