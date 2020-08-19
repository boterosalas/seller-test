import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { SharedModule } from '@app/shared/shared.module';
import { PendingProductsComponent } from '../pending-products/pending-products.component';
import { PendingProductsRoutingModule } from './pending-products.routing';
import { PendingProductsService } from './pending-products.service';
import { ComboPendingProductComponent } from './combo-pending-product/combo-pending-product.component';
import { ExpandedPendingProductsComponent } from './expanded-pending-products/expanded-pending-products.component';

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
        PendingProductsComponent,
        ComboPendingProductComponent,
        ExpandedPendingProductsComponent
    ],
    exports: [
        PendingProductsComponent,
        ComboPendingProductComponent,
        ExpandedPendingProductsComponent
    ],
    entryComponents: [
    ],
    providers: [
        PendingProductsService
    ]
})
export class PendingProductsModule {
}
