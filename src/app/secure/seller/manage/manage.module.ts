import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';

import { ManageComponent } from './manage.component';
import { ManageRoutingModule } from './manage.routing';
import { ToolbarSellerComponent } from './toolbar-seller/toolbar-seller.component';
import { AgreementComponent } from '../agreement/agreement.component';
import { AgreementService } from '../agreement/agreement.component.service';

import { ManageSellerComponent } from './manage-seller/manage-seller.component';
import { SharedModule } from '@shared/shared.module';
import { ManageSellerService } from './manage.service';
import { TermsComponent } from '../agreement/terms/terms.component';

@NgModule({
    declarations: [
        ManageComponent,
        ToolbarSellerComponent,
        ManageSellerComponent,
        AgreementComponent,
        TermsComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        ManageRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        SharedModule
    ],
    exports: [
    ],
    entryComponents: [
        TermsComponent
    ],
    providers: [
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher
        },
        ManageSellerService,
        AgreementService],
})
export class ManageModule { }
