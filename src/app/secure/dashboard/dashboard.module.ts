import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';


import { SharedModule } from '@shared/shared.module';
import { DashboardComponent } from '@app/secure/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@app/secure/dashboard/dashboard.routing';

@NgModule({
    declarations: [
        DashboardComponent
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
        SharedModule
    ],
    exports: [],
    providers: [
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher
        }
    ],
})
export class DashboardModule { }
