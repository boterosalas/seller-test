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
import { SearchSellerComponent } from './search-seller/search-seller.component';
import { EventEmitterSeller } from './events/eventEmitter-seller.service';
import { ManageSellerComponent } from './manage-seller/manage-seller.component';
import { SharedModule } from '@shared/shared.module';
import { ManageSellerService } from './manage.service';

@NgModule({
    declarations: [
        ManageComponent,
        SearchSellerComponent,
        ToolbarSellerComponent,
        ManageSellerComponent
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
    exports: [],
    providers: [
        EventEmitterSeller,
        ManageSellerService,
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher
        }],
})
export class ManageModule { }
