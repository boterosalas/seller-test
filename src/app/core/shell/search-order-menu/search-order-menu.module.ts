import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@shared/shared.module';

import { SearchBillingFormComponent } from './search-billing-form/search-billing-form.component';
import { SearchEnviosExitoFormComponent } from './search-envios-exito-form/search-envios-exito-form.component';
import { SearchOrderFormComponent } from './search-order-form/search-order-form.component';
import { SearchOrderMenuComponent } from './search-order-menu.component';
import { SearchOrderMenuService } from './search-order-menu.service';
import {
    SearchPendingDevolutionFormComponent,
} from './search-pending-devolution-form/search-pending-devolution-form.component';
import { SearchHistoricalDevolutionFormComponent } from './search-historical-devolution-form/search-historical-devolution-form.component';
import { SearchFraudNotificationFormComponent } from './search-fraud-notification-form/search-fraud-notification-form.component';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        SearchOrderMenuComponent,
        SearchOrderFormComponent,
        SearchBillingFormComponent,
        SearchPendingDevolutionFormComponent,
        SearchEnviosExitoFormComponent,
        SearchHistoricalDevolutionFormComponent,
        SearchFraudNotificationFormComponent
    ],
    exports: [
        SearchOrderMenuComponent
    ],
    providers: [
        SearchOrderMenuService
    ]
})
export class SearchOrderMenuModule { }
