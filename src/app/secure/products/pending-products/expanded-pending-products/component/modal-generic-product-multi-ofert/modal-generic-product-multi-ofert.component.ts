import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PendingProductsService } from '../../../pending-products.service';

@Component({
  selector: 'app-modal-generic-product-multi-ofert',
  templateUrl: './modal-generic-product-multi-ofert.component.html',
  styleUrls: ['./modal-generic-product-multi-ofert.component.scss']
})
export class ModalGenericProductMultiOfertComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalGenericProductMultiOfertComponent>,
    private pendingProductsService: PendingProductsService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
  approvedProduct() {
    this.pendingProductsService.sendApprovedProductMultiOfert().subscribe( result => {
      console.log(result);

    });
  }

  rejectProduct() {
    this.pendingProductsService.sendRejectProductProductMultiOfert().subscribe( result => {
      console.log(result);

    });

  }

}
