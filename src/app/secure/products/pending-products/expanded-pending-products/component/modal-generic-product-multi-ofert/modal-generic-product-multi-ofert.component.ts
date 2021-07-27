import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { PendingProductsService } from '../../../pending-products.service';

@Component({
  selector: 'app-modal-generic-product-multi-ofert',
  templateUrl: './modal-generic-product-multi-ofert.component.html',
  styleUrls: ['./modal-generic-product-multi-ofert.component.scss']
})
export class ModalGenericProductMultiOfertComponent implements OnInit {

  public showSuccessful = false;
  public showReject = false;
  public status = '';
  public processFinish$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalGenericProductMultiOfertComponent>,
    private pendingProductsService: PendingProductsService,
    private languageService: TranslateService,
    private loadingService?: LoadingService,
    private modalService?: ModalService,

  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
  approvedProduct() {
    const dataToSendApproved = {
      Status: 1,
      Id: this.data.id
    };
    this.loadingService.viewSpinner();
    this.pendingProductsService.sendAcceptRejectedProductMultiOfert(dataToSendApproved).subscribe(result => {
      if (result) {
        this.processFinish$.next();
        this.showSuccessful = true;
        this.status = this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_subtitle_msg_approved');
        this.loadingService.viewSpinner();
      } else {
        this.modalService.showModal('errorService');
        this.loadingService.viewSpinner();
      }
    });
  }

  rejectProduct() {
    const dataToSendRejectd = {
      Status: 2,
      Id: this.data.id
    };
    this.loadingService.viewSpinner();
    this.pendingProductsService.sendAcceptRejectedProductMultiOfert(dataToSendRejectd).subscribe(result => {
      if (result) {
        this.processFinish$.next();
        this.showReject = true;
        this.status = this.languageService.instant('secure.products.create_product_unit.list_products.expanded_product.multiOfert.modal_subtitle_msg_rejected')
        this.loadingService.viewSpinner();
      } else {
        this.modalService.showModal('errorService');
        this.loadingService.viewSpinner();
      }
    });

  }

}
