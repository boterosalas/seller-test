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

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ListProductRoutingModule,
      MaterialModule,
      FormsModule
    ],
    declarations: [
      ListProductsComponent,
      ComboProductComponent,
      ExpandedProductComponent
    ],
    exports: [
      ComboProductComponent,
      ExpandedProductComponent
    ],
    entryComponents: [

    ],
    providers: [
      ListProductService
    ]
  })
  export class ListProductModule {
  }
