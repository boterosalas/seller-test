/* 3rd party components */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../core/components/material-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';

/* our own custom components */
import { ListService } from './list.service';
import { ListRoutingModule } from './list.routing';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { ListComponent } from './list/list.component';
import { DetailOfferComponent } from './components/detail-offer/detail-offer.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    ListRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule
  ],
  declarations: [
    ListComponent,
    ToolbarComponent,
    FilterComponent,
    DetailOfferComponent
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ListService
  ]
})
export class ListModule {}
