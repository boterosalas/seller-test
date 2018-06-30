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
import { SupportModalComponent } from '../../components/common/support-modal/support-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/common/user/user.service';
import { HttpErrorHandlingService } from '../http/http-error-handling.service';
import { EndpointService } from '../http/endpoint.service';
import { ComponentsService } from '../services/common/components/components.service';
import { LoginModule } from '../../components/common/login/login.module';
import { ProfileModule } from '../../components/common/profile/profile.module';
import { SearchOrderMenuModule } from './search-order-menu/search-order-menu.module';
import { EventEmitterOrders } from '../event/eventEmitter-orders.service';
import { SupportModule } from '../../components/common/support-modal/support-modal.module';
import { ModalComponent } from './modal/modal.component';

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
        LoginModule,
        ProfileModule,
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
