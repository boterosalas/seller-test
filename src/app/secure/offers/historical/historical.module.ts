// 3rd party components
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule , DatePipe} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { MaterialModule } from '@app/material.module';

// our own custom components
import { SharedModule } from '@shared/shared.module';
import { HistoricalService } from './historical.service';
import { HistoricalRoutingModule } from './historical.routing';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilterComponent } from './components/filter/filter.component';
import { DownloadHistoricalModalModule } from './download-historical-modal/download-historical-modal.module';
import { HistoricalComponent } from './historical/historical.component';


@NgModule({
  imports: [
    SharedModule,
    BrowserModule,
    CommonModule,
    HistoricalRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule,
    DownloadHistoricalModalModule,
    MaterialModule
  ],
  declarations: [
    HistoricalComponent,
    ToolbarComponent,
    FilterComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    HistoricalService,
    DatePipe
  ]
})
export class HistoricalModule {}
