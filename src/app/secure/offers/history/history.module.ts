/* 3rd party components */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';

/* our own custom components */
import { HistoryService } from './history.service';
import { HistoryRoutingModule } from './history.routing';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { DownloadHistoryModalComponent } from './components/download-history-modal/download-history-modal.component';
// import { DownloadHistoryModalModule } from './components/download-history-modal/download-history-modal.module'; //Delete
import { DetailOfferComponent } from './components/detail-offer/detail-offer.component';
import { HistoryComponent } from './history/history.component';
import { MaterialModule } from '../../material-components';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    HistoryRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule
    // DownloadHistoryModalModule //Delete
  ],
  declarations: [
    HistoryComponent,
    ToolbarComponent,
    DetailOfferComponent,
    FilterComponent,
    DownloadHistoryModalComponent
  ],
  entryComponents: [
    DownloadHistoryModalComponent
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    HistoryService
  ]
})
export class HistoryModule {}
