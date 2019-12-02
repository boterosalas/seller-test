import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { PendingComponent } from './pending-page/pending.component';
import { PendingRoutinModule } from './pending.routing';
import { PendingService } from './pending.service';
import { ToolbarOptionsModule } from '@app/shared/components';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        PendingRoutinModule,
        ToolbarOptionsModule
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
