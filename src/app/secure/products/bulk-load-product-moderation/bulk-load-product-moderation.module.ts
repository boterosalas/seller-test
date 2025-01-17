import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { BulkLoadModule } from '@shared/components/bulk-load/bulk-load.module';

import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation/bulk-load-product-moderation.component';
import { BulkLoadProductModerationRoutingModule } from './bulk-load-product.routing';
import { SendModerationFormatModalComponent } from './send-moderation-format-modal/send-moderation-format-modal.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BulkLoadModule,
    BulkLoadProductModerationRoutingModule
  ],
  declarations: [
    BulkLoadProductModerationComponent,
    SendModerationFormatModalComponent
  ],
  entryComponents: [
    SendModerationFormatModalComponent
  ],
  exports: [
    SendModerationFormatModalComponent
  ]
})
export class BulkLoadProductModerationModule { }
