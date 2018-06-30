// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


// Local components
import { MaterialModule } from './../../../core/components/material-components';
import { PendingComponent } from './pending-page/pending.component';
import { PendingService } from './pending.service';
import { PendingRoutinModule } from './pending.routing.module';
import { ToolbarLinkModule } from '../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../shared/toolbar-options/toolbar-options.module';
import { ShipmentsService } from '../shipments.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        PendingRoutinModule,
        ToolbarLinkModule,
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
