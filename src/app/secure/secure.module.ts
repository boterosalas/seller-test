import { NgModule } from '@angular/core';
import { AwsCognitoModule } from '@app/secure/aws-cognito/aws-cognito.module';
import { BillingModule } from '@app/secure/billing/billing.module';
import { ErrorModule } from '@app/secure/error-page/error-page.module';
import { LoadGuideModule } from '@app/secure/load-guide-page/load-guide.module';
import { BulkLoadModule, ListModule, HistoricalModule, StoresModule, HistoricalModuleAdmin } from '@app/secure/offers';
import { InDevolutionModule, InValidationModule, OrdersModule, PendingDevolutionModule } from '@app/secure/orders';
import { BulkLoadProductModule, UnitProductModule } from '@app/secure/products';
import { RegisterModule, ManageModule } from '@app/secure/seller';
import { DetailModule, DispatchModule, HistoricModule, PendingModule, ReportsModule } from '@app/secure/shipments';
import { QuotingModule } from '@app/secure/offers/quoting/quoting.module';
import { DashboardModule } from '@app/secure/dashboard/dashboard.module';


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
    ],
    providers: [],
})
export class SecureModule {
}