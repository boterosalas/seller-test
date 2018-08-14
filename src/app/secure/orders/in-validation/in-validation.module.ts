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
import {
    EndpointService,
    UserService,
    HttpErrorHandlingService,
    ComponentsService,
    EventEmitterOrders
} from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { MaterialModule } from '../../../material.module';
import { ShellComponent } from '@core/shell/shell.component';


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
