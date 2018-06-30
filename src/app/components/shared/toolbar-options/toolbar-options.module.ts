/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* our own custom components */
import { DownloadOrderModalComponent } from './../../seller-center/orders/download-order-modal/download-order-modal.component';
import { MaterialModule } from '../../../core/components/material-components';
import { RouterModule } from '@angular/router';
import { ToolbarOptionsComponent } from './toolbar-options.component';
import { DownloadOrderModalModule } from '../../seller-center/orders/download-order-modal/download-order-modal.module';
import { ShellComponent } from '../../../core/shell/shell.component';
import { EndpointService } from '../../../core/http/endpoint.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { UserService } from '../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { EventEmitterOrders } from '../../../core/event/eventEmitter-orders.service';

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
