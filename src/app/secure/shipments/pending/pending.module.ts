// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


// Local components
import { PendingComponent } from './pending-page/pending.component';
import { PendingService } from './pending.service';
import { PendingRoutinModule } from './pending.routing';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { ShipmentsService } from '../shipments.service';
import { MaterialModule } from '../../material-components';

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
