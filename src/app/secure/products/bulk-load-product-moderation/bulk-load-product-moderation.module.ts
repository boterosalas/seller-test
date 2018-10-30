import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BulkLoadModule } from '@shared/components/bulk-load/bulk-load.module';

import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation/bulk-load-product-moderation.component';
import { BulkLoadProductModerationRoutingModule } from './bulk-load-product.routing';
import { SendModerationFormatModalComponent } from './send-moderation-format-modal/send-moderation-format-modal.component';


@NgModule({
  imports: [
    CommonModule,
    BulkLoadModule,
    BulkLoadProductModerationRoutingModule
  ],
  declarations: [
    BulkLoadProductModerationComponent,
    SendModerationFormatModalComponent
  ],
  entryComponents: [
    SendModerationFormatModalComponent
  ]
})
export class BulkLoadProductModerationModule { }
