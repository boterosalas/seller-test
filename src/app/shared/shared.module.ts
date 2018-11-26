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
import { DialogSharedComponent } from './components/dialogs/dialog.component';


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
    DialogSharedComponent
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
    DialogSharedComponent
  ],
  entryComponents: [
    DialogSharedComponent
  ],
  providers: [
    EventEmitterSeller,
  ]
})
export class SharedModule {
}
