/* 3rd party components */
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';

/* our own custom components */
import { DetailEntity } from '../../../../../shared';
import { FAKE } from '../../../utils/fakeData.model';

/** Component */
@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})

/**
 * Componente para visualizar la información de los productos
 */
export class ProductDetailBillingModalComponent {

  // Producto information
  product: DetailEntity;

  /**
   * Creates an instance of ProductDetailBillingModalComponent.
   * @param {MatDialogRef<ProductDetailBillingModalComponent>} dialogRef
   * @param {*} data
   * @memberof ProductDetailBillingModalComponent
   */
  constructor(public dialogRef: MatDialogRef<ProductDetailBillingModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.product = _.cloneDeep(data.product);
    // set empty data
    this.product = this.product || FAKE.FAKEORDERBILLING.detail[0];
  }

  /**
   * Método para cerrar el modal
   * @memberof ProductDetailBillingModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
