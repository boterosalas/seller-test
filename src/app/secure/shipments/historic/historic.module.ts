import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { MaterialModule } from '@app/material.module';
import { ShipmentsService } from '../shipments.service';
import { HistoricComponent } from './historic-page/historic.component';
import { HistoricRoutingModule } from './historic.routing';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    HistoricRoutingModule
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
