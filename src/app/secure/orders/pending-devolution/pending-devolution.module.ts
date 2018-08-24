import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';
import { ShellComponent } from '@core/shell/shell.component';

import { ActionAcceptDevolutionComponent } from './action-accept-devolution/action-accept-devolution.component';
import { ActionRefuseDevolutionComponent } from './action-refuse-devolution/action-refuse-devolution.component';
import { PendingDevolutionComponent } from './pending-devolution-page/pending-devolution.component';
import { PendingDevolutionRoutingModule } from './pending-devolution.routing';
import { PendingDevolutionService } from './pending-devolution.service';
import {
    ProductPendingDevolutionModalComponent,
} from './product-pending-devolution-modal/product-pending-devolution-modal.component';
import { ViewCommentComponent } from './view-comment/view-comment.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PendingDevolutionRoutingModule,
        SharedModule,
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
        ComponentsService,
        EventEmitterOrders,
        ShellComponent
    ]
})
export class PendingDevolutionModule { }
