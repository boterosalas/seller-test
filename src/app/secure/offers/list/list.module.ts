import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';

import { DetailOfferComponent } from './components/detail-offer/detail-offer.component';
import { FilterComponent } from './components/filter/filter.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ListRoutingModule } from './list.routing';
import { ListService } from './list.service';
import { ListComponent } from './list/list.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DialogDesactiveOffertComponent } from './list/dialog-desactive-offert/dialog-desactive-offert.component';
import { ModalProgramOfertComponent } from './components/modal-program-ofert/modal-program-ofert.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,
    ListRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule,
    CurrencyMaskModule
  ],
  declarations: [
    ListComponent,
    ToolbarComponent,
    FilterComponent,
    DetailOfferComponent,
    DialogDesactiveOffertComponent,
    ModalProgramOfertComponent
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ListService
  ],
  exports: [ListComponent],
  entryComponents: [DialogDesactiveOffertComponent, ListComponent, ModalProgramOfertComponent]
})
export class ListModule { }
