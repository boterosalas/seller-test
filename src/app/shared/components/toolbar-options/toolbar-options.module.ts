import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@app/material.module';
import { DownloadOrderModalModule } from '@secure/orders/download-order-modal/download-order-modal.module';
import { ToolbarOptionsComponent } from './toolbar-options.component';
import { TranslateModule } from '@ngx-translate/core';
import { DownloadListCancelsModalModule } from '@app/secure/orders/list-cancels-orders/download-report-list-cancels/download-report-list-cancels.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DownloadOrderModalModule,
    TranslateModule,
    DownloadListCancelsModalModule
  ],
  declarations: [
    ToolbarOptionsComponent,
  ],
  exports: [
    ToolbarOptionsComponent,
  ],
  providers: []
})
export class ToolbarOptionsModule {
}
