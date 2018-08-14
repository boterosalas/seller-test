// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


// Local components
import { DispatchRoutingModule } from './dispatched.routing';
import { DispatchedComponent } from './dispatched-page/dispatched.component';
import { ShipmentsService } from '../shipments.service';
import { MaterialModule } from '../../../material.module';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';

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
