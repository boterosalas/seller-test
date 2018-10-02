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
import { HistoricalAdminComponent } from '@app/secure/offers/historical-admin/historical-admin/historicalAdmin.component';
import { DownloadHistoricalModalAdminModule } from '@app/secure/offers/historical-admin/download-historical-modal/download-historical-modal.module';


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
    DownloadHistoricalModalAdminModule,
    MaterialModule,
  ],
  declarations: [
    HistoricalAdminComponent,
    ToolbarComponent,
    FilterComponent,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    HistoricalService,
    DatePipe
  ]
})
export class HistoricalModuleAdmin {}
