/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

/* our own custom components */
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { MaterialModule } from '../../../core/components/material-components';
import { ProfileRoutingModule } from './profile.routing.module';
import { ProfileComponent } from './profile-page/profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { UserService } from '../../../core/services/common/user/user.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ShellComponent } from '../../../core/shell/shell.component';
import { EventEmitterOrders } from '../../../core/event/eventEmitter-orders.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ProfileRoutingModule,
        MaterialModule,
    ],
    declarations: [
        ProfileComponent,
        EditProfileComponent,
        EditPasswordComponent
    ],
    exports: [
        ProfileComponent,
        EditProfileComponent,
        EditPasswordComponent
    ],
    providers: [
        ComponentsService,
        UserService,
        ShellComponent,
        EventEmitterOrders,
        EndpointService,
        HttpErrorHandlingService
    ]
})
export class ProfileModule { }
