// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// Local components
import { HeaderComponent } from './header/header.component';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoadingComponent } from './loading/loading.component';
import { MaterialModule } from '@secure/material-components';
import { SupportModalComponent } from '@secure/support-modal/support-modal.component';
import { SupportModule } from '@secure/support-modal/support-modal.module';

import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ModalComponent } from './modal/modal.component';

import {
    UserService,
    HttpErrorHandlingService,
    EndpointService,
    ComponentsService,
    EventEmitterOrders
} from '@app/shared';

/**
 * @export
 * @class ShellModule
 */
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        SearchOrderMenuModule,
        SupportModule
    ],
    declarations: [
        HeaderComponent,
        ShellComponent,
        SidebarComponent,
        LoadingComponent,
        ModalComponent
    ],
    exports: [
        HeaderComponent,
        ShellComponent,
        SidebarComponent,
        LoadingComponent,
        ModalComponent

    ],
    entryComponents: [
        SupportModalComponent,
        ModalComponent
    ],

    providers: [
        LoadingComponent,
        UserService,
        HttpErrorHandlingService,
        EndpointService,
        ComponentsService,
        ShellComponent,
        EventEmitterOrders,
        ModalComponent
    ]
})


export class ShellModule {
    /**
     * Creates an instance of ShellModule.
     * @memberof ShellModule
     */
    constructor() {
    }
}
