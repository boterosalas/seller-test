import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ReportOffertComponent } from './report-offert/report-offert.component';
import { ListReportRoutingModule } from './reports.routing';
import { DownloadModalOffertReportComponent } from './report-offert/download-modal-offert-report/download-modal-offert-report.component';
import { ReportOffertService } from './report-offert/report-offert.service';
import { ReportErrorsVtexComponent } from './report-errors-vtex/report-errors-vtex.component';
import { DownloadModalErrorVtexComponent } from './report-errors-vtex/download-modal-error-vtex/download-modal-error-vtex.component';
import { ReportCommissionComponent } from './report-commission/report-commission.component';
import { SharedModule } from '@app/shared/shared.module';
import { ReportDispersionComponent } from './report-dispersion/report-dispersion.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        CurrencyMaskModule,
        ListReportRoutingModule,
        SharedModule
    ],
    declarations: [
        ReportOffertComponent,
        DownloadModalOffertReportComponent,
        ReportErrorsVtexComponent,
        DownloadModalErrorVtexComponent,
        ReportCommissionComponent,
        ReportDispersionComponent,
    ],
    exports: [
        ReportOffertComponent
    ],
    entryComponents: [
        DownloadModalOffertReportComponent,
        DownloadModalErrorVtexComponent
    ],
    providers: [
        ReportOffertService
    ]
})
export class ListReportsModule {
}
