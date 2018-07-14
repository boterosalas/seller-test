// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Detail Component
import { DetailRoutingModule } from './detail.routing';
import { DetailComponent } from './detail-page/detail.component';
import { DetailService } from './detail.service';
import { ShipmentsService } from '../shipments.service';
import { MaterialModule } from '../../material-components';
import { ToolbarOptionsModule } from '../../../../../shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from '../../../../../shared/toolbar-link/toolbar-link.module';

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
