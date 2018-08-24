import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { PendingComponent } from './pending-page/pending.component';
import { PendingRoutinModule } from './pending.routing';
import { PendingService } from './pending.service';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SharedModule,
        PendingRoutinModule
    ],
    declarations: [
        PendingComponent
    ],
    exports: [
        PendingComponent
    ],
    providers: [
        PendingService,
        ShipmentsService
    ]
})

export class PendingModule { }
