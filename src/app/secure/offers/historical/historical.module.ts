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
import { HistoricalService } from './historical.service';
import { HistoricalRoutingModule } from './historical.routing';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { DownloadHistoricalModalModule } from './download-historical-modal/download-historical-modal.module';
import { HistoricalComponent } from './historical/historical.component';
import { MaterialModule } from '../../material-components';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    HistoricalRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule,
    DownloadHistoricalModalModule // Delete
  ],
  declarations: [
    HistoricalComponent,
    ToolbarComponent,
    FilterComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    HistoricalService
  ]
})
export class HistoricalModule {}
