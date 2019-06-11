// 3rd party components
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA , MatDialogRef} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// our own custom components
import { DownloadHistoricalModalComponent } from './download-historical-modal.component';
import { DownloadHistoricalService } from '@app/secure/offers/historical/download-historical-modal/download-historical.service';
import { MaterialModule } from '@app/material.module';
import { ComponentsService } from '@app/shared';
import { UserLoginService, EndpointService } from '@app/core';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  declarations: [
    DownloadHistoricalModalComponent
  ],
  entryComponents: [
    DownloadHistoricalModalComponent
  ],
  providers: [
    DownloadHistoricalService,
    ComponentsService,
    UserLoginService,
    EndpointService,
    DatePipe,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class DownloadHistoricalModalModule {
}
