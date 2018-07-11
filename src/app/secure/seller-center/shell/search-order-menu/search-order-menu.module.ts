/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { SearchOrderMenuComponent } from './search-order-menu.component';
import { SearchOrderFormComponent } from './search-order-form/search-order-form.component';
import { SearchBillingFormComponent } from './search-billing-form/search-billing-form.component';
import { ShellComponent } from '../shell.component';
import { MaterialModule } from '../../components/material-components';
import { SearchPendingDevolutionFormComponent } from './search-pending-devolution-form/search-pending-devolution-form.component';
import { SearchEnviosExitoFormComponent } from './search-envios-exito-form/search-envios-exito-form.component';
import { SearchOrderMenuService } from './search-order-menu.service';
import { EndpointService } from '../../utils/http/endpoint.service';
import { UserService } from '../../utils/services/common/user/user.service';
import { EventEmitterOrders } from '../../utils/event/eventEmitter-orders.service';
import { ComponentsService } from '../../utils/services/common/components/components.service';
import { BillingService } from '../../components/billing/billing.service';
import { HttpErrorHandlingService } from '../../utils/http/http-error-handling.service';


@NgModule({
    imports: [
        /* angular stuff */
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        /* our own custom components */
        MaterialModule,
    ],
    declarations: [
        SearchOrderMenuComponent,
        SearchOrderFormComponent,
        SearchBillingFormComponent,
        SearchPendingDevolutionFormComponent,
        SearchEnviosExitoFormComponent
    ],
    exports: [
        SearchOrderMenuComponent
    ],
    providers: [
        EndpointService,
        UserService,
        ShellComponent,
        SearchOrderMenuService,
        EventEmitterOrders,
        ComponentsService,
        BillingService,
        HttpErrorHandlingService
    ]
})
export class SearchOrderMenuModule { }
