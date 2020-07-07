import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from '@app/shared/shared.module';
import { PendingProductsComponent } from '../pending-products/pending-products.component';
import { PendingProductsRoutingModule } from './pending-products.routing';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        CurrencyMaskModule,
        SharedModule,
        PendingProductsRoutingModule
    ],
    declarations: [
        PendingProductsComponent
    ],
    exports: [
        PendingProductsComponent
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class PendingProductsModule {
}
