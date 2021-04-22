import { CommonModule, PercentPipe } from '@angular/common';
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { SearchSellerComponent } from '@app/shared/components/search-seller/search-seller.component';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { ControlMessagesComponent } from '@shared/components/control-messages/control-messages.component';

import { RouterModule } from '@angular/router';
import { CdkDetailRowDirective, NoWhitespaceDirective } from './directives';

import { ToolbarOptionsModule } from './components/toolbar-options';
import { ToolbarTittleModule } from './components/toolbar-tittle';
import { ErrorDialogComponent } from './components/dialogs/error-dialog.component';
import { DialogWithFormComponent } from './components/dialog-with-form/dialog-with-form.component';
import { CreateProcessDialogComponent } from './components/create-process-dialog/create-process-dialog.component';
import { CaseToolbarComponent } from './components/case-toolbar/case-toolbar.component';
import { ResponseCaseDialogComponent } from './components/response-case-dialog/response-case-dialog.component';
import { ProductsCaseDialogComponent } from './components/products-case-dialog/products-case-dialog.component';
import { CaseDetailComponent } from './components/case-detail/case-detail.component';
import { DropDownBoxComponent } from './components/drop-down-box/drop-down-box.component';
import { CaseFilterComponent } from './components/case-filter/case-filter.component';
import { ContentDropDownBoxDirective } from './components/drop-down-box/content-drop-down-box.directive';
import { DropDownListComponent } from './components/drop-down-list/drop-down-list.component';
import { BasicCardComponent } from './components/basic-card/basic-card.component';
import { PreviewListCardComponent } from './components/preview-list-card/preview-list-card.component';
import { CaseSummaryComponent } from './components/case-summary/case-summary.component';
import { ItemDropDownListDirective } from './components/drop-down-list/content-drop-down-list.directive';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ConversationMessageComponent } from './components/conversation-message/conversation-message.component';
import { ItemConversationDirective } from './components/conversation/item-conversation.directive';
import { DateNoGtmPipe } from './pipes/date-no-gtm.pipe';
import { ToolbarSearchPaginationModule } from './components/toolbar-search-pagination/toolbar-search-pagination.module';
import { NotificationCircleComponent } from './components/notification-circle/notification-circle.component';
import { StatesComponent } from './components/states/states.component';
import { CitiesComponent } from './components/cities/cities.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';
import { PortsComponent } from './components/ports/ports.component';
import { ContentDropDownDetailOrderDirective } from '@app/secure/orders/orders-list/orders-page/component/box-list/content-drop-down-detail-order.directive';
import { ModalDonwloadEmailComponent } from './components/modal-donwload-email/modal-donwload-email.component';
import { FlexSizePipe } from './pipes/flex-size.pipe';
import { ngfModule } from 'angular-file/file-upload/ngf.module';

export function createTranslateLaoder(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ngfModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLaoder),
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    SearchSellerComponent,
    ControlMessagesComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    CaseDetailComponent,
    ResponseCaseDialogComponent,
    ProductsCaseDialogComponent,
    CaseToolbarComponent,
    DropDownBoxComponent,
    CaseFilterComponent,
    ContentDropDownBoxDirective,
    DropDownListComponent,
    BasicCardComponent,
    PreviewListCardComponent,
    FlexSizePipe,
    CaseSummaryComponent,
    ItemDropDownListDirective,
    ConversationComponent,
    ConversationMessageComponent,
    ItemConversationDirective,
    DateNoGtmPipe,
    NotificationCircleComponent,
    StatesComponent,
    CitiesComponent,
    SelectLanguageComponent,
    UploadButtonComponent,
    PortsComponent,
    ContentDropDownDetailOrderDirective,
    ModalDonwloadEmailComponent,
  ],
  exports: [
    FlexSizePipe,
    MaterialModule,
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesComponent,
    CitiesComponent,
    PortsComponent,
    ToolbarTittleModule,
    SearchSellerComponent,
    ControlMessagesComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    CaseDetailComponent,
    ResponseCaseDialogComponent,
    ProductsCaseDialogComponent,
    CaseToolbarComponent,
    DropDownBoxComponent,
    CaseFilterComponent,
    ContentDropDownBoxDirective,
    DropDownListComponent,
    ItemDropDownListDirective,
    CaseSummaryComponent,
    ConversationComponent,
    ItemConversationDirective,
    DateNoGtmPipe,
    ToolbarSearchPaginationModule,
    NotificationCircleComponent,
    TranslateModule,
    SelectLanguageComponent,
    UploadButtonComponent,
    ContentDropDownDetailOrderDirective,
    ngfModule
  ],
  entryComponents: [
    ResponseCaseDialogComponent,
    ProductsCaseDialogComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    ModalDonwloadEmailComponent,
  ],
  providers: [EventEmitterSeller],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule { }
