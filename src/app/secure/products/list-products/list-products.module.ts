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
import { SharedModule } from '@app/shared/shared.module';
import { ModalRuleOfferComponent } from './modal-rule-offer/modal-rule-offer.component';
import { DownloadProductsComponent } from './download-products/download-products.component';
import { TabProductComponent } from './tab-product/tab-product.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ListProductRoutingModule,
      MaterialModule,
      FormsModule,
      CurrencyMaskModule,
      SharedModule
    ],
    declarations: [
      ListProductsComponent,
      ComboProductComponent,
      ExpandedProductComponent,
      OfertExpandedProductComponent,
      ModalRuleOfferComponent,
      DownloadProductsComponent,
      TabProductComponent,
    ],
    exports: [
      ComboProductComponent,
      ExpandedProductComponent,
      OfertExpandedProductComponent,
      ModalRuleOfferComponent
    ],
    entryComponents: [
      ModalRuleOfferComponent,
      DownloadProductsComponent
    ],
    providers: [
      ListProductService
    ]
  })
  export class ListProductModule {
  }
