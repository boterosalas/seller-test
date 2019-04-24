import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { SearchSellerComponent } from '@app/shared/components/search-seller/search-seller.component';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { ControlMessagesComponent } from '@shared/components/control-messages/control-messages.component';

import { CitiesModule } from './components/cities';
import { StatesModule } from './components/states';
import { ToolbarOptionsModule } from './components/toolbar-options';
import { ToolbarTittleModule } from './components/toolbar-tittle';
import { CdkDetailRowDirective, NoWhitespaceDirective } from './directives';
import { ErrorDialogComponent } from './components/dialogs/error-dialog.component';
import { DialogWithFormComponent } from './components/dialog-with-form/dialog-with-form.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { TranslateDirective } from './directives/translate/translate.directive';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    SearchSellerComponent,
    ControlMessagesComponent,
    ErrorDialogComponent,
    DialogWithFormComponent,
    TranslatePipe,
    TranslateDirective
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
    TranslatePipe,
    TranslateDirective
  ],
  entryComponents: [
    ErrorDialogComponent,
    DialogWithFormComponent
  ],
  providers: [
    EventEmitterSeller,
  ]
})
export class SharedModule {
}
