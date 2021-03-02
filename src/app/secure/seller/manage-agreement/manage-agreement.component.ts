import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { LoadingService, Logger, ModalService } from '@app/core';
import { SellerService } from '../seller.service';
import { ModalBulkloadAgreementComponent } from './modal-bulkload-agreement/modal-bulkload-agreement.component';

const log = new Logger('ManageAgreementComponent');

@Component({
  selector: 'app-manage-agreement',
  templateUrl: './manage-agreement.component.html',
  styleUrls: ['./manage-agreement.component.scss']
})
export class ManageAgreementComponent implements OnInit {

  manageAgreementsSeller: any;

  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  length = 0;
  public pageSize = 3;

  public arrayPosition = [];
  paramsArray: any;
  pageSizeOptions: number[] = [3, 6, 9];
  pageEvent: PageEvent;
  public callOne = true;


  constructor(
    private dialog: MatDialog,
    private sellerService: SellerService,
    private loading: LoadingService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.getAllBrands();
  }

  /**
   * Funcion para abrir modal para agregar masivamente acuerdos
   * @memberof ManageAgreementComponent
   */
  openModalBulkLoadAgreement() {
    const dialogRef = this.dialog.open(ModalBulkloadAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

  public getAllBrands(params?: any) {
    this.loading.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = params;
    } else {
      urlParams = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`
    }
    this.sellerService.getAllAgreement(urlParams).subscribe((result: any) => {
      if (result) {
        this.manageAgreementsSeller = result.ViewModel;
        this.titleAgreement = result.ContractName;
        if (this.callOne) {
          this.length = result.Count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = result.PaginationToken;
        this.loading.closeSpinner();
      }
    }, error => {
      this.loading.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  paginations(event: any): any {
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event.pageIndex >= 0) {
      const index = event.pageIndex;
      if (index === 0) {
        this.paginationToken = encodeURI('{}');
      }
      const isExistInitial = this.arrayPosition.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition.push('{}');
      }
      const isExist = this.arrayPosition.includes(this.paginationToken);
      if (isExist === false) {
        this.arrayPosition.push(this.paginationToken);
      }
      this.paginationToken = this.arrayPosition[index];
      if (this.paginationToken === undefined) {
        this.paginationToken = encodeURI('{}');
      }
      this.paramsArray = {
        'limit': this.limit + '&paginationToken=' + this.paginationToken
      };
      this.getAllBrands();
    }
  }

}
