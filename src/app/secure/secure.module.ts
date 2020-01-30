import { NgModule } from '@angular/core';

import { AwsCognitoModule } from '@app/secure/aws-cognito/aws-cognito.module';
import { BillingModule } from '@app/secure/billing/billing.module';
import { DashboardModule } from '@app/secure/dashboard/dashboard.module';
import { ErrorModule } from '@app/secure/error-page/error-page.module';
import { LoadGuideModule } from '@app/secure/load-guide-page/load-guide.module';
import {
  BulkLoadModule,
  HistoricalModule,
  HistoricalModuleAdmin,
  ListModule,
  ListAdminModule,
  StoresModule
} from '@app/secure/offers';
import { QuotingModule } from '@app/secure/offers/quoting/quoting.module';
import {
  InDevolutionModule,
  InValidationModule,
  OrdersModule,
  PendingDevolutionModule,
  HistoricalDevolutionModule
} from '@app/secure/orders';
import { BulkLoadProductModule, UnitProductModule } from '@app/secure/products';
import { ManageModule, RegisterModule } from '@app/secure/seller';
import {
  DetailModule,
  DispatchModule,
  HistoricModule,
  PendingModule,
  ReportsModule
} from '@app/secure/shipments';
import { SellerModule } from './seller/seller.module';
import { BillingOrdersModule } from './orders/billing-orders/billing-orders.module';
import { AuthService } from './auth/auth.routing';
import { ParameterizeModule } from './parameterize/parameterize.module';
import { BulkLoadProductModerationModule } from './products/bulk-load-product-moderation/bulk-load-product-moderation.module';
import { ListProductModule } from './products/list-products/list-products.module';
import { SellerSupportCenterService } from './seller-support-center/services/seller-support-center.service';
import { SellerSupportCenterModule } from './seller-support-center/seller-support-center.module';
import { CoreStoreModule } from '../store';
import { ListReportsModule } from './reports/reports.module';
import { QualityModule } from './quality/quality.module';

@NgModule({
  declarations: [],
  imports: [
    AwsCognitoModule,
    ErrorModule,
    LoadGuideModule,
    OrdersModule,
    InValidationModule,
    PendingDevolutionModule,
    HistoricalDevolutionModule,
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
    ListAdminModule,
    HistoricalModule,
    BulkLoadProductModule,
    QuotingModule,
    DashboardModule,
    HistoricalModuleAdmin,
    UnitProductModule,
    BulkLoadProductModerationModule,
    BillingOrdersModule,
    ListProductModule,
    SellerModule,
    BillingOrdersModule,
    ParameterizeModule,
    SellerSupportCenterModule,
    CoreStoreModule,
    ListReportsModule,
    QualityModule
  ],
  providers: [AuthService, SellerSupportCenterService]
})
export class SecureModule {}
