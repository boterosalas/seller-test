import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BillingOrderComponent } from './billing-orders.component';
import { BillingOrdersRoutingModule } from './billing-orders.routing';
import { MatToolbarModule } from '@angular/material';
import { MaterialModule } from '@app/material.module';
import { SearchSellerComponent } from '@app/shared/components/search-seller/search-seller.component';
import { SharedModule } from '@app/shared/shared.module';
import { BillingOrdersService } from './billing-orders.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        BillingOrdersRoutingModule,
        MatToolbarModule,
        MaterialModule,
        SharedModule

    ],
    declarations: [
        BillingOrderComponent,
    ],
    exports: [
        BillingOrderComponent,
    ],
    entryComponents: [
        BillingOrderComponent
    ],
    providers: [
        BillingOrdersService,
    ]
})
export class BillingOrdersModule {
}
