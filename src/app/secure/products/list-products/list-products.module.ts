import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ListProductsComponent } from './list-products.component';
import { ListProductRoutingModule } from './list-products.routing';
import { MaterialModule } from '@app/material.module';
import { ToolbarComponent } from '@app/secure/offers/historical/components/toolbar/toolbar.component';
import { ComboProductComponent } from './comboProduct/comboProduct.component';
import { ListProductService } from './list-products.service';
import { ExpandedProductComponent } from './expanded-product/expanded-product.component';
import { OfertExpandedProductComponent } from './ofert-product/ofert-product.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ListProductRoutingModule,
      MaterialModule,
      FormsModule,
      CurrencyMaskModule
    ],
    declarations: [
      ListProductsComponent,
      ComboProductComponent,
      ExpandedProductComponent,
      OfertExpandedProductComponent
    ],
    exports: [
      ComboProductComponent,
      ExpandedProductComponent,
      OfertExpandedProductComponent
    ],
    entryComponents: [

    ],
    providers: [
      ListProductService
    ]
  })
  export class ListProductModule {
  }
