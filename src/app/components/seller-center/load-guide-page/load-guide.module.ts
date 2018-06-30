/* 3rd party components */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

/* our own custom components */
import {MaterialModule} from '../../../core/components/material-components';
import {LoadGuidePageComponent} from './load-guide/load-guide-page.component';
import {TableLoadComponent} from './table-load/table-load.component';
import {LoadGuideService} from './load-guide.service';
import {TableErrorsComponent} from './table-errors/table-errors.component';
import {FinishUploadInformationComponent} from './finish-upload-information/finish-upload-information.component';
import {LoadGuideRoutingModule} from './load-guide.routing.module';
import {DownloadFormatComponent} from './download-format/download-format.component';
import {ComponentsService} from '../../../core/services/common/components/components.service';
import {EndpointService} from '../../../core/http/endpoint.service';
import {HttpErrorHandlingService} from '../../../core/http/http-error-handling.service';
import {UserService} from '../../../core/services/common/user/user.service';
import {ShellComponent} from '../../../core/shell/shell.component';
import {EventEmitterOrders} from '../../../core/event/eventEmitter-orders.service';


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
