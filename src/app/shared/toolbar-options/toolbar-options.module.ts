/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/* our own custom components */
import { RouterModule } from '@angular/router';
import { ToolbarOptionsComponent } from './toolbar-options.component';
import { MaterialModule } from '../../secure/seller-center/components/material-components';
import { DownloadOrderModalModule } from '../../secure/seller-center/components/orders/download-order-modal/download-order-modal.module';
import { ShellComponent } from '../../secure/seller-center/shell/shell.component';
import { EndpointService } from '../../secure/seller-center/utils/http/endpoint.service';
import { HttpErrorHandlingService } from '../../secure/seller-center/utils/http/http-error-handling.service';
import { UserService } from '../../secure/seller-center/utils/services/common/user/user.service';
import { ComponentsService } from '../../secure/seller-center/utils/services/common/components/components.service';
import { EventEmitterOrders } from '../../secure/seller-center/utils/event/eventEmitter-orders.service';

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
