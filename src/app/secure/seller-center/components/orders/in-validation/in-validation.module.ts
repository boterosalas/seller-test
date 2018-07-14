/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { ViewCommentComponent } from './view-comment/view-comment.component';
import { InValidationRoutingModule } from './in-validation.routing';
import { InValidationComponent } from './in-validation-page/in-validation.component';
import { InValidationModalComponent } from './in-validation-modal/in-validation-modal.component';
import { InValidationService } from './in-validation.service';
import { ToolbarOptionsModule } from '../../../../../shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from '../../../../../shared/toolbar-link/toolbar-link.module';
import { MaterialModule } from '../../material-components';
import { EndpointService } from '../../../utils/http/endpoint.service';
import { UserService } from '../../../utils/services/common/user/user.service';
import { HttpErrorHandlingService } from '../../../utils/http/http-error-handling.service';
import { ComponentsService } from '../../../utils/services/common/components/components.service';
import { EventEmitterOrders } from '../../../utils/event/eventEmitter-orders.service';
import { ShellComponent } from '../../../shell/shell.component';


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
