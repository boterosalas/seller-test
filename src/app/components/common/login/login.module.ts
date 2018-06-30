
/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/* our own custom components */
import { LogoutComponent } from './logout/logout.component';
import { RecoveryComponent } from './recovery-page/recovery.component';
import { ShellComponent } from '../../../core/shell/shell.component';
import { UserService } from '../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { MaterialModule } from '../../../core/components/material-components';
import { LoginService } from './login.service';
import { LoginComponent } from './login-page/login.component';
import { LoginRoutingModule } from './login.routing.module';
import { EventEmitterOrders } from '../../../core/event/eventEmitter-orders.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        LoginRoutingModule,
        HttpClientModule,
        MaterialModule,
    ],
    declarations: [
        LoginComponent,
        RecoveryComponent,
        LogoutComponent
    ],
    exports: [
        LoginComponent,
        RecoveryComponent,
        LogoutComponent
    ],
    providers: [
        LogoutComponent,
        LoginService,
        EventEmitterOrders,
        EndpointService,
        UserService,
        ComponentsService,
        ShellComponent,
        HttpErrorHandlingService
    ]
})

export class LoginModule { }
