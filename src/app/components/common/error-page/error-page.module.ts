/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/* our own custom components */
import { UserService } from '../../../core/services/common/user/user.service';
import { ShellComponent } from '../../../core/shell/shell.component';
import { ErrorPageComponent } from './error-page.component';
import { MaterialModule } from '../../../core/components/material-components';
import { HttpClientModule } from '@angular/common/http';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { EventEmitterOrders } from '../../../core/event/eventEmitter-orders.service';

/**
 * @export
 * @class ErrroModule
 */
@NgModule({
    imports: [
        MaterialModule,
        RouterModule,
        HttpClientModule,
    ],
    declarations: [
        ErrorPageComponent,
    ],
    providers: [
        UserService,
        EndpointService,
        EventEmitterOrders,
        HttpErrorHandlingService,
        ShellComponent,
        ComponentsService
    ]
})

export class ErrroModule {
    
    /**
     * Creates an instance of ErrroModule.
     * @memberof ErrroModule
     */
    constructor() {
    }
}
