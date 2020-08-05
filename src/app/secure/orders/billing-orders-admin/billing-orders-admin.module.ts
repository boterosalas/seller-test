import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import { BillingOrdersAdminComponent } from './billing-orders-admin.component';
import { BillingOrdersAdminRoutingModule } from './billing-orders-admin.routing';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MaterialModule,
        SharedModule,
        BillingOrdersAdminRoutingModule

    ],
    declarations: [
        BillingOrdersAdminComponent,
    ],
    exports: [
        BillingOrdersAdminComponent,
    ],
    entryComponents: [
        BillingOrdersAdminComponent
    ],
    providers: [
        // BillingOrdersService,
    ]
})
export class BillingOrdersAdminModule {
}
