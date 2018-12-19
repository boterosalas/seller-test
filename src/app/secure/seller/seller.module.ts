import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SellerListComponent } from './list/list-sellers.component';
import { SellerRoutingModule } from './seller.routing';
import { SellerService } from './seller.service';


@NgModule({
    declarations: [
        SellerListComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        SellerRoutingModule
    ],
    exports: [
    ],
    entryComponents: [
    ],
    providers: [
        SellerService
    ],
})
export class SellerModule { }
