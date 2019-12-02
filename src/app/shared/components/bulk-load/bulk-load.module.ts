import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';

import { BulkLoadComponent } from './bulk-load/bulk-load.component';
import { ShowErrorsComponent } from './errors-load/errors-load.component';
import { CommonService } from '@app/shared/services/common.service';
import { SendModerationFormatModalService } from '@app/secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.service';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [
    BulkLoadComponent,
    ShowErrorsComponent
  ],
  exports: [
    BulkLoadComponent,
    ShowErrorsComponent
  ],
  providers: [
    CommonService,
    SendModerationFormatModalService
  ]
})
export class BulkLoadModule {
}
