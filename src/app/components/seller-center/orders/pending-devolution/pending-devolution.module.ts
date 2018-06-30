/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { ActionAcceptDevolutionComponent } from './action-accept-devolution/action-accept-devolution.component';
import { HttpErrorHandlingService } from '../../../../core/http/http-error-handling.service';
import { EndpointService } from '../../../../core/http/endpoint.service';
import { MaterialModule } from '../../../../core/components/material-components';
import { PendingDevolutionService } from './pending-devolution.service';
import { PendingDevolutionRoutingModule } from './pending-devolution.routing.module';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';
import { ProductPendingDevolutionModalComponent } from './product-pending-devolution-modal/product-pending-devolution-modal.component';
import { ActionRefuseDevolutionComponent } from './action-refuse-devolution/action-refuse-devolution.component';
import { ToolbarOptionsModule } from '../../../shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from '../../../shared/toolbar-link/toolbar-link.module';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { UserService } from '../../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { EventEmitterOrders } from '../../../../core/event/eventEmitter-orders.service';
import { ViewCommentComponent } from './view-comment/view-comment.component';


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