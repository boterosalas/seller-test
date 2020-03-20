import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotingSellerComponent } from './quoting-seller.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { ModalQuotingSellerComponent } from './modal-quoting-seller/modal-quoting-seller.component';

@NgModule({
  declarations: [
    QuotingSellerComponent,
    ModalQuotingSellerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    MaterialModule,
  ],
  exports: [
    QuotingSellerComponent
  ],
  providers: [],
  entryComponents: [ModalQuotingSellerComponent]
})
export class QuotingSellerModule { }
