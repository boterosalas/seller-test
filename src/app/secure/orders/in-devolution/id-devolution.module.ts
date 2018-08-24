import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ShellComponent } from '@app/core/shell';
import { MaterialModule } from '@app/material.module';
import { EventEmitterOrders } from '@app/shared';
import { SharedModule } from '@app/shared/shared.module';

import { ActionConfirmReceiptComponent } from './action-confirm-receipt/action-confirm-receipt.component';
import { ActionReportNoveltyComponent } from './action-report-novelty/action-report-novelty.component';
import { BillingRoutingModule } from './id-devolution.routing';
import { InDevolutionService } from './id-devolution.service';
import { InDevolutionComponent } from './in-devolution-page/in-devolution.component';
import { ProductDevolutionModalComponent } from './product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from './view-comment/view-comment.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BillingRoutingModule,
        SharedModule,
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
        ShellComponent,
        EventEmitterOrders,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ]
})
export class InDevolutionModule { }
