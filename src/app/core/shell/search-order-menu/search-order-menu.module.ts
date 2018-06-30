/* 3rd party components */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { HttpErrorHandlingService } from '../../http/http-error-handling.service';
import { EndpointService } from '../../http/endpoint.service';
import { SearchOrderMenuComponent } from './search-order-menu.component';
import { SearchOrderFormComponent } from './search-order-form/search-order-form.component';
import { SearchBillingFormComponent } from './search-billing-form/search-billing-form.component';
import { UserService } from '../../services/common/user/user.service';
import { ComponentsService } from '../../services/common/components/components.service';
import { BillingService } from '../../../components/seller-center/billing/billing.service';
import { ShellComponent } from '../shell.component';
import { EventEmitterOrders } from '../../event/eventEmitter-orders.service';
import { MaterialModule } from '../../components/material-components';
import { SearchPendingDevolutionFormComponent } from './search-pending-devolution-form/search-pending-devolution-form.component';
import { SearchEnviosExitoFormComponent } from './search-envios-exito-form/search-envios-exito-form.component';
import { SearchOrderMenuService } from './search-order-menu.service';


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
