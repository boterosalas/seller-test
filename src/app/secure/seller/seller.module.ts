import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { SellerListComponent } from './list/list-sellers.component';
import { SellerRoutingModule } from './seller.routing';
import { SellerService } from './seller.service';
import { StoresService } from '../offers/stores/stores.service';
import { MatSidenav, MatSidenavModule } from '@angular/material';
import { DialogWithFormComponent } from './list/dialog-with-form/dialog-with-form.component';


@NgModule({
    declarations: [
        SellerListComponent,
        DialogWithFormComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MaterialModule,
        SellerRoutingModule,
        MatSidenavModule
    ],
    exports: [
        DialogWithFormComponent
    ],
    entryComponents: [
        DialogWithFormComponent
    ],
    providers: [
        SellerService,
        StoresService
    ],
})
export class SellerModule { }
