import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
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
        MatTabsModule
    ],
    declarations: [
        // ListCancelsOrdersComponent
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
