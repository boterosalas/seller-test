import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@app/shared/shared.module';
import { ListCancelsOrdersComponent } from './list-cancels-orders.component';
import { ListCancelOrderRoutingModule } from './list-cancels-orders.routing';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ListCancelOrderRoutingModule
    ],
    declarations: [
        // ListCancelsOrdersComponent
    ],
    exports: [

    ],
    entryComponents: [

    ],
    providers: [
    ]
})
export class ListCancelsOrdersModule { }
