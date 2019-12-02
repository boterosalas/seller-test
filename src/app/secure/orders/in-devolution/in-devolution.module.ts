import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/shared/shared.module';

import { ActionConfirmReceiptComponent } from './action-confirm-receipt/action-confirm-receipt.component';
import { ActionReportNoveltyComponent } from './action-report-novelty/action-report-novelty.component';
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { BillingRoutingModule } from './in-devolution.routing';
import { ProductDevolutionModalComponent } from './product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import { InDevolutionService } from './in-devolution.service';
import { ToolbarOptionsModule } from '@app/shared/components';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BillingRoutingModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToolbarOptionsModule
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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        InDevolutionService
    ]
})
export class InDevolutionModule { }
