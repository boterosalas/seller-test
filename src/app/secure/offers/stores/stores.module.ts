import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';

import { EventEmitterStore } from './events/eventEmitter-store.service';
import { SearchStoreComponent } from './search-store/search-store.component';
import { StoreComponent } from './store/store.component';
import { StoresRoutingModule } from './stores.routing';
import { StoresService } from './stores.service';
import { TreeToolbarComponent } from './tree-toolbar/tree-toolbar.component';
import { InputCommisionComponent } from './tree/components/input-commision/input-commision.component';
import { NoContentComponent } from './tree/components/no-content/no-content.component';
import { TreeComponentComponent } from './tree/components/tree-component/tree-component.component';
import { TreeCategoriesComponent } from './tree/tree-categories/tree-categories.component';
import { ExceptionBrandComponent } from './tree/components/exception-brand/exception-brand.component';


@NgModule({
  imports: [
    CommonModule,
    StoresRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientJsonpModule
  ],
  declarations: [
    StoreComponent,
    TreeCategoriesComponent,
    TreeComponentComponent,
    NoContentComponent,
    TreeToolbarComponent,
    SearchStoreComponent,
    InputCommisionComponent,
    ExceptionBrandComponent
  ],
  providers: [
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    EventEmitterStore,
    StoresService
  ]
})
export class StoresModule {

}

