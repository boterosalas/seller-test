import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { CommonService } from '@shared/services/common.service';
import { ProductsCaseDialogComponent } from '../products-case-dialog/products-case-dialog.component';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { ACCEPT_TYPE } from '@app/shared/models';
import { TranslateService } from '@ngx-translate/core';

const productsConfig = require('./products-list-configuration.json');

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit {
  @Input() case: Case;

  @Output() reply = new EventEmitter<any>();

  configDialog = {
    width: '50%',
    height: 'fit-content',
    data: { title: 'texts' }
  };

  productsConfig: Array<any>;

  isClosed: boolean;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public commonServices: CommonService,
    public http: HttpClient,
    public translateService: TranslateService
  ) { }

  ngOnInit() {
    this.productsConfig = productsConfig;
    this.isClosed = this.case.status === 'Cerrado';
  }

  openResponseDialog(): void {
    if (this.isClosed) {
      this.snackBar.open(
        'El caso ya se encuentra en estado cerrado, no es posible agregar comentarios.',
        'Cerrar',
        {
          duration: 3000
        }
      );
    } else {
      this.reply.emit(this.case);
    }
  }

  onClickShowAllProducts() {
    const dialogRef = this.dialog.open(
      ProductsCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => { });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}

export interface Case {
  id: string;
  sellerId: string;
  caseId: string;
  status: string;
  orderNumber: string;
  reasonPQR: string;
  reasonDetail: string;
  description: string;
  descriptionSolution: string;
  createDate: string;
  updateDate: string;
  customerEmail: string;
  read: boolean;
  follow: Array<any>;
  attachments: Array<any>;
  caseNumber: string;
}
