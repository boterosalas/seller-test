import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatFormFieldModule, MatInputModule } from '@angular/material';

import { DashboardService } from './services/dashboard.service';

import { SharedModule } from '@shared/shared.module';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@app/secure/dashboard/dashboard.routing';
import { TermsService } from '../seller/agreement/terms/terms.component.service';
import { SellerRatingComponent } from './seller-rating/seller-rating.component';
import { MaterialModule } from '@app/material.module';
import { ModalDashboardComponent } from './modal-dashboard/modal-dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent,
        SellerRatingComponent,
        ModalDashboardComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        DashboardRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MaterialModule
    ],
    entryComponents: [
        ModalDashboardComponent
    ],
    exports: [],
    providers: [
        DashboardService,
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher
        },
        TermsService,
        DatePipe
    ],
})
export class DashboardModule { }
