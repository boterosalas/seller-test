/* 3rd party components */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import relevant http modules
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';

/* our own custom components */
import { EventEmitterStore } from './events/eventEmitter-store.service';
import { StoresService } from './stores.service';
import { StoresRoutingModule } from './stores.routing.module';
import { TreeToolbarComponent } from './tree-toolbar/tree-toolbar.component';
import { SearchStoreComponent } from './search-store/search-store.component';
import { StoreComponent } from './store/store.component';
import { TreeCategoriesComponent } from './tree/tree-categories/tree-categories.component';
import { TreeComponentComponent } from './tree/components/tree-component/tree-component.component';
import { InputCommisionComponent } from './tree/components/input-commision/input-commision.component';
import { NoContentComponent } from './tree/components/no-content/no-content.component';
import { MaterialModule } from '../../material-components';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    StoresRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientJsonpModule
  ],
  declarations: [
    StoreComponent,
    TreeCategoriesComponent,
    TreeComponentComponent,
    NoContentComponent,
    TreeToolbarComponent,
    SearchStoreComponent,
    InputCommisionComponent
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    EventEmitterStore,
    StoresService
  ]
})
export class StoresModule {

}

