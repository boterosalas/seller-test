import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { DetailComponent } from './detail-page/detail.component';
import { DetailRoutingModule } from './detail.routing';
import { DetailService } from './detail.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DetailRoutingModule
    ],
    declarations: [
        DetailComponent
    ],
    exports: [
        DetailComponent
    ],
    providers: [
        DetailService,
        ShipmentsService
    ]
})

export class DetailModule { }
