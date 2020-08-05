import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@app/shared/shared.module';

import { InValidationModalComponent } from './in-validation-modal/in-validation-modal.component';
import { InValidationComponent } from './in-validation-page/in-validation.component';
import { InValidationRoutingModule } from './in-validation.routing';
import { ViewCommentComponent } from './view-comment/view-comment.component';
import { ToolbarOptionsModule } from '@app/shared/components';
import { InValidationService } from './in-validation.service';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InValidationRoutingModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToolbarOptionsModule
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
        InValidationService
    ]
})
export class InValidationModule { }
