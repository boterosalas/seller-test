/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* our own custom components */
import { RouterModule } from '@angular/router';
import { ToolbarOptionsComponent } from './toolbar-options.component';
import { MaterialModule } from '@secure/material-components';
import { DownloadOrderModalModule } from '@secure/orders/download-order-modal/download-order-modal.module';
import { ShellComponent } from '@core/shell/shell.component';
import {
    EndpointService,
    HttpErrorHandlingService,
    UserService,
    ComponentsService,
    EventEmitterOrders
} from './../services';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        DownloadOrderModalModule
    ],
    declarations: [
        ToolbarOptionsComponent,
    ],
    exports: [
        ToolbarOptionsComponent,
    ],
    providers: [
        ShellComponent,
        EndpointService,
        HttpErrorHandlingService,
        UserService,
        ComponentsService,
        EventEmitterOrders,
    ]
})
export class ToolbarOptionsModule { }
