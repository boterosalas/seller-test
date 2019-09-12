import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import * as FileSaver from 'file-saver';

import { ProductsCaseDialogComponent } from '../products-case-dialog/products-case-dialog.component';
import { HttpClient } from '@angular/common/http';
import { File, ACCEPT_TYPE } from '../upload-button/configuration.model';
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
    private httpClient: HttpClient
  ) {}

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
    dialogRef.afterClosed().subscribe(result => {});
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof DownloadFormatComponent
   */
  downloadFileFromUrl(url: string, fileName: string, type: ACCEPT_TYPE): void {
    this.httpClient.get(url, { responseType: 'arraybuffer' }).subscribe(s => {
      const blob = new Blob([s], { type });
      FileSaver.saveAs(blob, fileName);
    });
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
}
