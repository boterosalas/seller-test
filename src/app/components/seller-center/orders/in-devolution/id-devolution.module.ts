/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { MaterialModule } from '../../../../core/components/material-components';
import { EndpointService } from '../../../../core/http/endpoint.service';
import { HttpErrorHandlingService } from '../../../../core/http/http-error-handling.service';
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { InDevolutionService } from './id-devolution.service';
import { BillingRoutingModule } from './id-devolution.routing.module';
import { ActionReportNoveltyComponent } from './action-report-novelty/action-report-novelty.component';
import { ActionConfirmReceiptComponent } from './action-confirm-receipt/action-confirm-receipt.component';
import { ProductDevolutionModalComponent } from './product-devolution-modal/product-devolution-modal.component';
import { ToolbarLinkModule } from '../../../shared/toolbar-link/toolbar-link.module';
import { ToolbarOptionsModule } from '../../../shared/toolbar-options/toolbar-options.module';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { EventEmitterOrders } from '../../../../core/event/eventEmitter-orders.service';
import { ViewCommentComponent } from './view-comment/view-comment.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BillingRoutingModule,
        ToolbarLinkModule,
        ToolbarOptionsModule,
        MaterialModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    declarations: [
        InDevolutionComponent,
        ActionReportNoveltyComponent,
        ActionConfirmReceiptComponent,
        ProductDevolutionModalComponent,
        ViewCommentComponent
    ],
    exports: [
        InDevolutionComponent,
        ActionReportNoveltyComponent,
        ActionConfirmReceiptComponent,
        ProductDevolutionModalComponent,
        ViewCommentComponent
    ],
    entryComponents: [
        ActionConfirmReceiptComponent,
        ActionReportNoveltyComponent,
        ProductDevolutionModalComponent,
        ViewCommentComponent
    ],
    providers: [
        InDevolutionService,
        EndpointService,
        ShellComponent,
        EventEmitterOrders,
        HttpErrorHandlingService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class InDevolutionModule { }
