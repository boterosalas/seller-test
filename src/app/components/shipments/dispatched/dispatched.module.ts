// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


// Local components
import { DispatchRoutingModule } from './dispatched.routing.module';
import { MaterialModule } from '../../../core/components/material-components';
import { DispatchedComponent } from './dispatched-page/dispatched.component';
import { ToolbarLinkModule } from '../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../shared/toolbar-options/toolbar-options.module';
import { ShipmentsService } from '../shipments.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        DispatchRoutingModule,
        ToolbarLinkModule,
        ToolbarOptionsModule
    ],
    declarations: [
        DispatchedComponent
    ],
    exports: [
        DispatchedComponent
    ],
    providers: [
        ShipmentsService
    ]
})

export class DispatchModule { }
