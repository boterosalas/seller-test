/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { ActionAcceptDevolutionComponent } from './action-accept-devolution/action-accept-devolution.component';
import { PendingDevolutionService } from './pending-devolution.service';
import { PendingDevolutionRoutingModule } from './pending-devolution.routing';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';
import { ProductPendingDevolutionModalComponent } from './product-pending-devolution-modal/product-pending-devolution-modal.component';
import { ActionRefuseDevolutionComponent } from './action-refuse-devolution/action-refuse-devolution.component';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import {
    EndpointService,
    HttpErrorHandlingService,
    UserService,
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
        PendingDevolutionRoutingModule,
        ToolbarOptionsModule,
        ToolbarLinkModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    declarations: [
        PendingDevolutionComponent,
        ProductPendingDevolutionModalComponent,
        ActionAcceptDevolutionComponent,
        ActionRefuseDevolutionComponent,
        ViewCommentComponent
    ],
    exports: [
        PendingDevolutionComponent,
        ProductPendingDevolutionModalComponent,
        ActionAcceptDevolutionComponent,
        ActionRefuseDevolutionComponent,
        ViewCommentComponent
    ],
    entryComponents: [
        ActionAcceptDevolutionComponent,
        ActionRefuseDevolutionComponent,
        ProductPendingDevolutionModalComponent,
        ViewCommentComponent
    ],
    providers: [
        PendingDevolutionService,
        EndpointService,
        HttpErrorHandlingService,
        UserService,
        ComponentsService,
        EventEmitterOrders,
        ShellComponent
    ]
})
export class PendingDevolutionModule { }
