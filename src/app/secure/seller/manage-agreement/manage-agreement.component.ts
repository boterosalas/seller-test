import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

  public getAllBrands() {
    this.loading.viewSpinner();
    const urlParams = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`
    this.sellerService.getAllAgreement(urlParams).subscribe((result: any) => {
       console.log('result: ', result);
       if (result ) {
        this.manageAgreementsSeller = result.ViewModel;
        this.titleAgreement = result.ContractName;
        this.loading.closeSpinner();
       }
       
        // if (res && parseInt(res.Total) > 0) {
        //     this.brandsList = res.Brands;
        //     this.length = res.Total;
        //     this.sortedData = this.mapItems(
        //         res.Brands,
        //     );
        // } else {
        //     this.sortedData = null;
        // }

    }, error => {
        this.loading.closeSpinner();
        this.modalService.showModal('errorService');
    });
}

}
