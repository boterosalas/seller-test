// @Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';



// Local components
import { MaterialModule } from '../components/material-components';
import { HeaderComponent } from './header/header.component';
import { ShellComponent } from './shell.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoadingComponent } from './loading/loading.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { ModalComponent } from './modal/modal.component';
import { SupportModule } from '../components/support-modal/support-modal.module';
import { SupportModalComponent } from '../components/support-modal/support-modal.component';
import { UserService } from '../utils/services/common/user/user.service';
import { HttpErrorHandlingService } from '../utils/http/http-error-handling.service';
import { EndpointService } from '../utils/http/endpoint.service';
import { ComponentsService } from '../utils/services/common/components/components.service';
import { EventEmitterOrders } from '../utils/event/eventEmitter-orders.service';

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
