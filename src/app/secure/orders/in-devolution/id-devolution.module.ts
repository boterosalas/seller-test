/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* our own custom components */
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { InDevolutionService } from './id-devolution.service';
import { BillingRoutingModule } from './id-devolution.routing';
import { ActionReportNoveltyComponent } from './action-report-novelty/action-report-novelty.component';
import { ActionConfirmReceiptComponent } from './action-confirm-receipt/action-confirm-receipt.component';
import { ProductDevolutionModalComponent } from './product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import {
    EndpointService,
    EventEmitterOrders,
    HttpErrorHandlingService
} from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { MaterialModule } from '../../material-components';
import { ShellComponent } from '@core/shell/shell.component';

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
