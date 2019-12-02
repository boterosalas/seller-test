import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { HistoricComponent } from './historic-page/historic.component';
import { HistoricRoutingModule } from './historic.routing';
import { ToolbarOptionsModule } from '@app/shared/components';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
    ShipmentsService
  ]
})

export class HistoricModule { }
