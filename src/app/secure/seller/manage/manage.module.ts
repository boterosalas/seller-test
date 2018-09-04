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
import { MaterialModule } from '@app/material.module';
import { EventEmitterSeller } from './events/eventEmitter-seller.service';
import { ManageSellerComponent } from './manage-seller/manage-seller.component';
import { FormManageSellerComponent } from './manage-seller/form-manage-seller/form-manage-seller.component';

@NgModule({
    declarations: [
        ManageComponent,
        SearchSellerComponent,
        ToolbarSellerComponent,
        ManageSellerComponent,
        FormManageSellerComponent
    ],
    imports: [
        MaterialModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        ManageRoutingModule,
        HttpClientModule,
        HttpClientJsonpModule,
    ],
    exports: [],
    providers: [
        EventEmitterSeller,
        {
            provide: ErrorStateMatcher,
            useClass: ShowOnDirtyErrorStateMatcher
        }],
})
export class ManageModule { }
