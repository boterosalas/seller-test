/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

/* our own custom components */
import {LoadGuidePageComponent} from './load-guide/load-guide-page.component';
import {TableLoadComponent} from './table-load/table-load.component';
import {LoadGuideService} from './load-guide.service';
import {TableErrorsComponent} from './table-errors/table-errors.component';
import {FinishUploadInformationComponent} from './finish-upload-information/finish-upload-information.component';
import {LoadGuideRoutingModule} from './load-guide.routing';
import {DownloadFormatComponent} from './download-format/download-format.component';
import { MaterialModule } from '../material-components';
import {
  ComponentsService,
  HttpErrorHandlingService,
  EndpointService,
  UserService,
  EventEmitterOrders } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    LoadGuideRoutingModule,
    BrowserAnimationsModule
  ],
  declarations: [
    LoadGuidePageComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    DownloadFormatComponent,
    TableLoadComponent
  ],
  exports: [
    LoadGuidePageComponent,
    FinishUploadInformationComponent,
    TableErrorsComponent,
    DownloadFormatComponent,
    TableLoadComponent
  ],
  entryComponents: [
    DownloadFormatComponent,
    FinishUploadInformationComponent
  ],
  providers: [
    ComponentsService,
    LoadGuideService,
    HttpErrorHandlingService,
    EndpointService,
    UserService,
    ShellComponent,
    LoadGuidePageComponent,
    EventEmitterOrders,
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {provide: MatDialogRef, useValue: {}}
  ]
})
export class LoadGuideModule {
}
