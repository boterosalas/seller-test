import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { ToolbarLinkModule } from '@shared/components/toolbar-link';
import { ToolbarOptionsModule } from '@shared/components/toolbar-options';
import { CdkDetailRowDirective, NoWhitespaceDirective } from '@shared/directives';
import { StatesModule } from '@shared/components/states';
import { CitiesModule } from '@shared/components/cities';
import { SearchSellerComponent } from '@app/shared/components/search-seller/search-seller.component';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';


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
  ],
  exports: [
    MaterialModule,
    ToolbarLinkModule,
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesModule,
    CitiesModule,
    SearchSellerComponent
  ],
  providers: [
    EventEmitterSeller,
  ]
})
export class SharedModule {
}
