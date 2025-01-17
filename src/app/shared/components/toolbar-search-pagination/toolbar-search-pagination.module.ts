import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarSearchPaginationComponent } from './toolbar-search-pagination.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { DownloadOrderModalModule } from '@secure/orders/download-order-modal/download-order-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DownloadOrderModalModule,
    TranslateModule
  ],
  declarations: [
    ToolbarSearchPaginationComponent
  ],
  exports: [
    ToolbarSearchPaginationComponent,
  ],
})
export class ToolbarSearchPaginationModule { }
