import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DownloadModalOffertReportComponent } from './download-modal-offert-report/download-modal-offert-report.component';
import { Logger } from '@app/core';

const log = new Logger('ReportOffertComponent');

@Component({
  selector: 'app-report-offert',
  templateUrl: './report-offert.component.html',
  styleUrls: ['./report-offert.component.scss']
})
export class ReportOffertComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openModalDownloadReportOffert(): void {
    const dialogRef = this.dialog.open(DownloadModalOffertReportComponent, {
      data: {
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

}

