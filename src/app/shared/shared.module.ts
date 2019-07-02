import { CommonModule, PercentPipe } from "@angular/common";
import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "@app/material.module";
import { SearchSellerComponent } from "@app/shared/components/search-seller/search-seller.component";
import { EventEmitterSeller } from "@app/shared/events/eventEmitter-seller.service";
import { ControlMessagesComponent } from "@shared/components/control-messages/control-messages.component";

import { RouterModule } from "@angular/router";
import { StatesModule } from "./components/states";
import { CdkDetailRowDirective, NoWhitespaceDirective } from "./directives";

import { ToolbarOptionsModule } from "./components/toolbar-options";
import { ToolbarTittleModule } from "./components/toolbar-tittle";
import { CitiesModule } from "./components/cities";
import { ErrorDialogComponent } from "./components/dialogs/error-dialog.component";
import { DialogWithFormComponent } from "./components/dialog-with-form/dialog-with-form.component";
import { CreateProcessDialogComponent } from "./components/create-process-dialog/create-process-dialog.component";
import { ConversationCardComponent } from "./components/conversation-card/conversation-card.component";
import { CaseToolbarComponent } from "./components/case-toolbar/case-toolbar.component";
import { ResponseCaseDialogComponent } from "./components/response-case-dialog/response-case-dialog.component";
import { ProductsCaseDialogComponent } from "./components/products-case-dialog/products-case-dialog.component";
import { CaseDetailComponent } from "./components/case-detail/case-detail.component";
import { DropDownBoxComponent } from "./components/drop-down-box/drop-down-box.component";
import { CaseFilterComponent } from "./components/case-filter/case-filter.component";
import { ContentDropDownBoxDirective } from "./components/drop-down-box/content-drop-down-box.directive";
import { DropDownListComponent } from "./components/drop-down-list/drop-down-list.component";
import { BasicCardComponent } from "./components/basic-card/basic-card.component";
import { PreviewListCardComponent } from "./components/preview-list-card/preview-list-card.component";
import { FlexSizePipe } from "./components/drop-down-list-header/flex-size.pipe";
import { DropDownListHeaderComponent } from "./components/drop-down-list-header/drop-down-list-header.component";
import { CaseSummaryComponent } from "./components/case-summary/case-summary.component";
import { ItemDropDownListDirective } from "./components/drop-down-list/content-drop-down-list.directive";
import { ConversationComponent } from "./components/conversation/conversation.component";
import { ConversationMessageComponent } from "./components/conversation-message/conversation-message.component";
import { ItemConversationDirective } from "./components/conversation/item-conversation.directive";
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    SearchSellerComponent,
    ControlMessagesComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent,
    ConversationCardComponent,
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
    DropDownListHeaderComponent,
    CaseSummaryComponent,
    ItemDropDownListDirective,
    ConversationComponent,
    ConversationMessageComponent,
    ItemConversationDirective
  ],
  exports: [
    MaterialModule,
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesModule,
    CitiesModule,
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
    DropDownListHeaderComponent,
    ItemDropDownListDirective,
    CaseSummaryComponent,
    ConversationComponent,
    ItemConversationDirective
  ],
  entryComponents: [
    ResponseCaseDialogComponent,
    ProductsCaseDialogComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent
  ],
  providers: [EventEmitterSeller],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SharedModule {}
