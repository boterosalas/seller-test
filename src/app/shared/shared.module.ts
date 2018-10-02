import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { ToolbarOptionsModule } from './components/toolbar-options';
import { CdkDetailRowDirective, NoWhitespaceDirective } from './directives';
import { StatesModule } from './components/states';
import { CitiesModule } from './components/cities';
import { ToolbarTittleModule } from './components/toolbar-tittle';
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
    ToolbarOptionsModule,
    CdkDetailRowDirective,
    NoWhitespaceDirective,
    StatesModule,
    CitiesModule,
    ToolbarTittleModule,
    SearchSellerComponent
  ],
  providers: [
    EventEmitterSeller,
  ]
})
export class SharedModule {
}
