import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from '@app/core';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';

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
        EventEmitterOrders,
        ShellComponent,
        ComponentsService
    ]
})

export class ErrorModule {}
