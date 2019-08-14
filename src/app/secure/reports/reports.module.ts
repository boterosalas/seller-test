import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@app/material.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ReportOffertComponent } from './report-offert/report-offert.component';
import { ListReportRoutingModule } from './reports.routing';
import { DownloadModalOffertReportComponent } from './report-offert/download-modal-offert-report/download-modal-offert-report.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        CurrencyMaskModule,
        ListReportRoutingModule
    ],
    declarations: [
        ReportOffertComponent,
        DownloadModalOffertReportComponent
    ],
    exports: [
        ReportOffertComponent
    ],
    entryComponents: [

    ],
    providers: [
    ]
})
export class ListReportsModule {
}
