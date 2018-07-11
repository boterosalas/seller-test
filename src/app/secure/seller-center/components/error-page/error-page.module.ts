/* 3rd party components */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { ErrorPageComponent } from './error-page.component';
import { MaterialModule } from '../material-components';
import { UserService } from '../../utils/services/common/user/user.service';
import { EndpointService } from '../../utils/http/endpoint.service';
import { EventEmitterOrders } from '../../utils/event/eventEmitter-orders.service';
import { HttpErrorHandlingService } from '../../utils/http/http-error-handling.service';
import { ShellComponent } from '../../shell/shell.component';
import { ComponentsService } from '../../utils/services/common/components/components.service';

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
