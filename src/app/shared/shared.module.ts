import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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
import { HistoryCardComponent } from "./components/history-card/history-card.component";
import { CaseToolbarComponent } from "./components/case-toolbar/case-toolbar.component";
import { CaseModalComponent } from "./components/case-modal/case-modal.component";
import { CaseDetailComponent } from "./components/case-detail/case-detail.component";

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
    HistoryCardComponent,
    CaseDetailComponent,
    CaseModalComponent,
    CaseToolbarComponent
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
    CaseModalComponent,
    CaseToolbarComponent
  ],
  entryComponents: [
    CaseModalComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    CreateProcessDialogComponent
  ],
  providers: [EventEmitterSeller]
})
export class SharedModule {}
