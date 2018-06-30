
/* 3rd party libraries */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LOCALE_ID } from '@angular/core';
// import 'hammerjs';

/* our own custom components */
import { AppComponent } from './app.component';
import { MaterialModule } from './core/components/material-components';
import { AppRoutingModule } from './app-routing.module';
import { ShellModule } from './core/shell/shell.module';

// seller-center-components
import { LoadGuideModule } from './components/seller-center/load-guide-page/load-guide.module';
import { BillingModule } from './components/seller-center/billing/billing.module';
import { HomeModule } from './components/seller-center/home/home.module';
import { BulkLoadModule } from './components/seller-center/offers/bulk-load/bulk-load.module';

// shipments-components

import { HistoricModule } from './components/shipments/historic/historic.module';
import { PendingModule } from './components/shipments/pending/pending.module';
import { DispatchModule } from './components/shipments/dispatched/dispatched.module';
import { ToolbarOptionsModule } from './components/shared/toolbar-options/toolbar-options.module';
import { ToolbarLinkModule } from './components/shared/toolbar-link/toolbar-link.module';
import { ErrroModule } from './components/common/error-page/error-page.module';
import { OrdersModule } from './components/seller-center/orders/orders-list/orders.module';
import { DetailModule } from './components/shipments/detail/detail.module';
import { InValidationModule } from './components/seller-center/orders/in-validation/in-validation.module';
import { PendingDevolutionModule } from './components/seller-center/orders/pending-devolution/pending-devolution.module';
import { InDevolutionModule } from './components/seller-center/orders/in-devolution/id-devolution.module';

// import of seller register module - Pragma
import { StoresModule } from './components/seller-center/offers/stores/stores.module';
import { RegisterModule } from './components/seller-center/seller/register/register.module';
import { environment } from '../environments/environment';
import { AwsCognitoModule } from './components/aws-cognito/aws-cognito.module';
import { ListModule } from './components/seller-center/offers/list/list.module';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    /* angular stuff */
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,

    /* 3rd party components */
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    /* our own custom components */
    ShellModule,
    HomeModule,
    ErrroModule,
    LoadGuideModule,
    OrdersModule,
    InValidationModule,
    PendingDevolutionModule,
    InDevolutionModule,
    ToolbarOptionsModule,
    ToolbarLinkModule,
    BillingModule,
    // Shipments-modules
    // ReportsModule,
    RegisterModule,
    PendingModule,
    StoresModule,
    HistoricModule,
    DispatchModule,
    DetailModule,
    BulkLoadModule,
    ListModule,

    // Routing app
    AppRoutingModule,
    AwsCognitoModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' }],
  bootstrap: [AppComponent],

})
export class AppModule { }
