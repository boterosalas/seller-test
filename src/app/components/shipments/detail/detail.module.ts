// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Local components
import { MaterialModule } from '../../../core/components/material-components';
import { ToolbarLinkModule } from '../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../shared/toolbar-options/toolbar-options.module';

// Detail Component
import { DetailRoutingModule } from './detail.routing.module';
import { DetailComponent } from './detail-page/detail.component';
import { DetailService } from './detail.service';
import { ShipmentsService } from '../shipments.service';

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
