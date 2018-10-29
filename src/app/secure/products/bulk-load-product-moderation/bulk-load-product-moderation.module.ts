import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkLoadProductModerationRoutingModule } from './bulk-load-product-moderation-routing.module';
import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation.component';

@NgModule({
  imports: [
    CommonModule,
    BulkLoadProductModerationRoutingModule
  ],
  declarations: [BulkLoadProductModerationComponent]
})
export class BulkLoadProductModerationModule { }
