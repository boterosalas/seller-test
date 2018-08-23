import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InDevolutionService } from '@app/secure/orders/in-devolution/in-devolution.service';
import {
    ProductDevolutionModalComponent,
} from '@app/secure/orders/in-devolution/product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from '@app/secure/orders/in-devolution/view-comment/view-comment.component';
import { EndpointService, EventEmitterOrders, HttpErrorHandlingService } from '@app/shared';
import { ToolbarLinkModule } from '@app/shared/toolbar-link';
import { ToolbarOptionsModule } from '@app/shared/toolbar-options';
import { ShellComponent } from '@root/src/app/core/shell/shell.component';
import { MaterialModule } from '@root/src/app/secure/material-components';
import {
    ActionConfirmReceiptComponent,
} from '@secure/orders/in-devolution/action-confirm-receipt/action-confirm-receipt.component';
import { BillingRoutingModule } from '@secure/orders/in-devolution/in-devolution.routing';

import { ActionReportNoveltyComponent } from './action-report-novelty/action-report-novelty.component';
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';

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
