import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DownloadModalErrorVtexComponent } from './download-modal-error-vtex/download-modal-error-vtex.component';

@Component({
  selector: 'app-report-errors-vtex',
  templateUrl: './report-errors-vtex.component.html',
  styleUrls: ['./report-errors-vtex.component.scss']
})
export class ReportErrorsVtexComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openModalDownloadReportErrorsVtex() {
    const dialogRef = this.dialog.open(DownloadModalErrorVtexComponent, {
      data: {
      },
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}

