import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProductsCaseDialogComponent } from '../products-case-dialog/products-case-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { CaseSupportCenterService } from '@app/secure/seller-support-center/services/case-support-center.service';
import { InfoModalSupportComponent } from '@app/secure/seller-support-center/info-modal-support/info-modal-support.component';
const productsConfig = require('./products-list-configuration.json');

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.scss']
})
export class CaseSummaryComponent implements OnInit {
  // @Input() case: Case;
  case = [];
  @Input() set _case(value: any) {
    if (value) {
      this.case = value;
    }
  }

  @Input() disabled: false;

  @Input() indexParent: string;

  @Input() disabledClass: false;

  @Output() clickResponse = new EventEmitter<any>();
  @Output() idDetail = new EventEmitter<any>();

  // idDetail = false;

  configDialog = {
    width: '50%',
    height: 'fit-content',
    data: { title: 'texts' }
  };

  productsConfig: Array<any>;

  disableButtonAnswer = false;

  constructor(public dialog: MatDialog,
    public translateService: TranslateService,
    public redirecServ: CaseSupportCenterService
  ) {
    if (localStorage.getItem('typeProfile') === 'seller' || localStorage.getItem('typeProfile') === null || localStorage.getItem('typeProfile') === undefined || localStorage.getItem('typeProfile') === '') {
      this.disableButtonAnswer = false;
    } else {
      this.disableButtonAnswer = true;
    }
  }

  ngOnInit() {
    this.productsConfig = productsConfig;
  }

  openResponseDialog(): void {
    this.clickResponse.emit(this.case);
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

  // Metodo para reidrigir al detalle de seguimiento.
  redirecToDetail(caseId: any) {
    // this.redirecServ.redirectToDetailsServ(caseId, this.case.sellerId);
    this.idDetail.emit(caseId);
  }

      /**
   * funcion para mostrar el modal del producto
   *
   * @param {*} module
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
       showThumbnail(dataProduct: any) {
        this.dialog.open(InfoModalSupportComponent, {
          data: {
            dataProduct
          },
          width: '300px',
          maxWidth: '90vw',
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
  createDate: string;
  updateDate: string;
  customerEmail: string;
  read: boolean;
  followLast: Array<any>;
  caseNumber: string;
}
