import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { ComponentsService, EndpointService, EventEmitterOrders, HttpErrorHandlingService, UserService } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { ErrorPageComponent } from './error-page.component';


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

export class ErrorModule {}
