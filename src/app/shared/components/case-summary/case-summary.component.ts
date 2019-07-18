import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProductsCaseDialogComponent } from '../products-case-dialog/products-case-dialog.component';
const productsConfig = require('./products-list-configuration.json');

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.scss']
})
export class CaseSummaryComponent implements OnInit {
  @Input() case: Case;

  @Input() disabled: false;

  @Output() onClickResponse = new EventEmitter<any>();

  configDialog = {
    width: '50%',
    height: 'fit-content',
    data: { title: 'texts' }
  };

  productsConfig: Array<any>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.productsConfig = productsConfig;
  }

  openResponseDialog(): void {
    this.onClickResponse.emit(this.case);
  }

  onClickShowAllProducts() {
    const dialogRef = this.dialog.open(
      ProductsCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => {});
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}

export interface Case {
  id: string;
  sellerId: string;
  caseId: string;
  status: number;
  orderNumber: string;
  reasonPQR: string;
  reasonDetail: string;
  description: string;
  createDate: string;
  updateDate: string;
  customerEmail: string;
  read: boolean;
  followLast: Array<any>;
}
