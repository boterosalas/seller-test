import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {
    UserRegistrationService,
    UserParametersService,
    UserLoginService,
    CognitoUtil,
    AwsUtil,
    DynamoDBService
} from './shared/index';
import { AppRoutingModule } from './app.routes.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LOCALE_ID } from '@angular/core';
import 'hammerjs';

/* our own custom components */
import { MaterialModule } from './secure/material-components';
import { AppComponent } from '.';
import { HomeModule } from './public/home.module';
import { AwsCognitoModule } from './secure/aws-cognito/aws-cognito.module';
import { ShellModule } from './core/shell/shell.module';
import { ErrroModule } from './secure/error-page/error-page.module';
import { LoadGuideModule } from './secure/load-guide-page/load-guide.module';
import { OrdersModule } from './secure/orders/orders-list/orders.module';
import { InValidationModule } from './secure/orders/in-validation/in-validation.module';
import { PendingDevolutionModule } from './secure/orders/pending-devolution/pending-devolution.module';
import { InDevolutionModule } from './secure/orders/in-devolution/id-devolution.module';
import { ToolbarOptionsModule } from './shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from './shared/toolbar-link/toolbar-link.module';
import { BillingModule } from './secure/billing/billing.module';
import { RegisterModule } from './secure/seller/register/register.module';
import { PendingModule } from './secure/shipments/pending/pending.module';
import { StoresModule } from './secure/offers/stores/stores.module';
import { HistoricModule } from './secure/shipments/historic/historic.module';
import { DispatchModule } from './secure/shipments/dispatched/dispatched.module';
import { DetailModule } from './secure/shipments/detail/detail.module';
import { BulkLoadModule } from './secure/offers/bulk-load/bulk-load.module';
import { ListModule } from './secure/offers/list/list.module';
import { HistoryModule } from './secure/offers/history/history.module';
import { ReportsModule } from './secure/shipments/reports/reports.module';
import { BulkLoadProductModule } from './secure/products/bulk-load-product/bulk-load-product.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
         /* angular stuff */
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        BrowserAnimationsModule,

        /* 3rd party components */
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        MaterialModule,

        /* our own custom components */
        HomeModule,
        AwsCognitoModule,
        ShellModule,
        ErrroModule,
        LoadGuideModule,
        OrdersModule,
        InValidationModule,
        PendingDevolutionModule,
        InDevolutionModule,
        ToolbarOptionsModule,
        ToolbarLinkModule,
        BillingModule,
        RegisterModule,
        PendingModule,
        ReportsModule,
        StoresModule,
        HistoricModule,
        DispatchModule,
        DetailModule,
        BulkLoadModule,
        ListModule,
        HistoryModule,
        BulkLoadProductModule,

        /* Routing App */
        AppRoutingModule
    ],
    providers: [
        CognitoUtil,
        AwsUtil,
        DynamoDBService,
        UserRegistrationService,
        UserLoginService,
        UserParametersService,
        { provide: LOCALE_ID, useValue: 'es-CO' }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
