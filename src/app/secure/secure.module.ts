import { NgModule } from '@angular/core';

import { AwsCognitoModule } from '@app/secure/aws-cognito/aws-cognito.module';
import { BillingModule } from '@app/secure/billing/billing.module';
import { DashboardModule } from '@app/secure/dashboard/dashboard.module';
import { ErrorModule } from '@app/secure/error-page/error-page.module';
import { LoadGuideModule } from '@app/secure/load-guide-page/load-guide.module';
import { BulkLoadModule, HistoricalModule, HistoricalModuleAdmin, ListModule, StoresModule } from '@app/secure/offers';
import { QuotingModule } from '@app/secure/offers/quoting/quoting.module';
import { InDevolutionModule, InValidationModule, OrdersModule, PendingDevolutionModule } from '@app/secure/orders';
import { BulkLoadProductModule, UnitProductModule } from '@app/secure/products';
import { ManageModule, RegisterModule } from '@app/secure/seller';
import { DetailModule, DispatchModule, HistoricModule, PendingModule, ReportsModule } from '@app/secure/shipments';
import { SellerModule } from './seller/seller.module';
import { BillingOrdersModule } from './orders/billing-orders/billing-orders.module';
import { ParameterizeModule } from './parameterize/parameterize.module';
import { BulkLoadProductModerationModule } from './products/bulk-load-product-moderation/bulk-load-product-moderation.module';


@NgModule({
  declarations: [],
  imports: [
    AwsCognitoModule,
    ErrorModule,
    LoadGuideModule,
    OrdersModule,
    InValidationModule,
    PendingDevolutionModule,
    InDevolutionModule,
    BillingModule,
    RegisterModule,
    ManageModule,
    PendingModule,
    ReportsModule,
    HistoricModule,
    DispatchModule,
    DetailModule,
    StoresModule,
    BulkLoadModule,
    ListModule,
    HistoricalModule,
    BulkLoadProductModule,
    QuotingModule,
    DashboardModule,
    HistoricalModuleAdmin,
    UnitProductModule,
    BulkLoadProductModerationModule,
    SellerModule,
    BillingOrdersModule,
    ParameterizeModule
  ],
  providers: [],
})
export class SecureModule {
}
