/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { ToolbarOptionsModule } from '../../../shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from '../../../shared/toolbar-link/toolbar-link.module';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { UserService } from '../../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { EventEmitterOrders } from '../../../../core/event/eventEmitter-orders.service';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import { InValidationRoutingModule } from './in-validation.routing.module';
import { InValidationComponent } from './in-validation-page/in-validation.component';
import { InValidationModalComponent } from './in-validation-modal/in-validation-modal.component';
import { InValidationService } from './in-validation.service';
import { MaterialModule } from '../../../../core/components/material-components';
import { EndpointService } from '../../../../core/http/endpoint.service';
import { HttpErrorHandlingService } from '../../../../core/http/http-error-handling.service';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InValidationRoutingModule,
        ToolbarOptionsModule,
        ToolbarLinkModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    declarations: [
        InValidationComponent,
        InValidationModalComponent,
        ViewCommentComponent
    ],
    exports: [
        InValidationComponent,
        InValidationModalComponent,
        ViewCommentComponent
    ],
    entryComponents: [
        InValidationModalComponent,
        ViewCommentComponent
    ],
    providers: [
        InValidationService,
        EndpointService,
        HttpErrorHandlingService,
        UserService,
        ComponentsService,
        EventEmitterOrders,
        ShellComponent
    ]
})
export class InValidationModule { }