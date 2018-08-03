// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Detail Component
import { DetailRoutingModule } from './detail.routing';
import { DetailComponent } from './detail-page/detail.component';
import { DetailService } from './detail.service';
import { ShipmentsService } from '../shipments.service';
import { MaterialModule } from '../../material-components';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DetailRoutingModule,
        ToolbarLinkModule,
        ToolbarOptionsModule
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
