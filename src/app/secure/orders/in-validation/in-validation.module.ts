import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { ComponentsService, EventEmitterOrders, SharedModule } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { InValidationModalComponent } from './in-validation-modal/in-validation-modal.component';
import { InValidationComponent } from './in-validation-page/in-validation.component';
import { InValidationRoutingModule } from './in-validation.routing';
import { InValidationService } from './in-validation.service';
import { ViewCommentComponent } from './view-comment/view-comment.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InValidationRoutingModule,
        SharedModule,
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
        ComponentsService,
        EventEmitterOrders,
        ShellComponent
    ]
})
export class InValidationModule { }
