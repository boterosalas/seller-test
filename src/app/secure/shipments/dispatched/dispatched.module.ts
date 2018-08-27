import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ShipmentsService } from '../shipments.service';
import { DispatchedComponent } from './dispatched-page/dispatched.component';
import { DispatchRoutingModule } from './dispatched.routing';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DispatchRoutingModule
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
