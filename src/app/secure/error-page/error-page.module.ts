/* 3rd party components */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { ErrorPageComponent } from './error-page.component';
import { MaterialModule } from '../material-components';
import {
    UserService,
    EndpointService,
    EventEmitterOrders,
    HttpErrorHandlingService,
    ComponentsService
 } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

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
