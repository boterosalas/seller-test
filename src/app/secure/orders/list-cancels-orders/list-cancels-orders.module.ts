import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { HistoricalDevolutionModule } from '..';
import { HistoricalDevolutionComponent } from '../historical-devolution/historical-devolution-page/historical-devolution.component';
import { InValidationComponent } from '../in-validation/in-validation-page/in-validation.component';
import { InValidationModule } from '../in-validation/in-validation.module';
import { ListCancelsOrdersComponent } from './list-cancels-orders.component';
import { ListCancelOrderRoutingModule } from './list-cancels-orders.routing';



@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ListCancelOrderRoutingModule,
        TranslateModule,
        MatTabsModule,
        HistoricalDevolutionModule,
        InValidationModule
    ],
    declarations: [
        ListCancelsOrdersComponent,
        // InValidationComponent,
        // HistoricalDevolutionComponent
    ],
    exports: [

    ],
    entryComponents: [

    ],
    providers: [
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class ListCancelsOrdersModule { }
