import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ListProductsComponent } from './list-products.component';
import { ListProductRoutingModule } from './list-products.routing';

@NgModule({
    imports: [
      CommonModule,
      ReactiveFormsModule,
      ListProductRoutingModule
    ],
    declarations: [
      ListProductsComponent
    ],
    exports: [
    ],
    entryComponents: [

    ],
    providers: [
    ]
  })
  export class ListProductModule {
  }
