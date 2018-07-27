import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

import { Billing, User } from '../../../../../shared';
import { FAKE } from '../../../utils/fakeData.model';


/** Component */
@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss']
})

/** Componente para visualizar el detalle de la información de la orden */
export class OrderBillingDetailModalComponent {

  // User information
  user: User;
  // Order information
  order: Billing;

  /**
   * Creates an instance of OrderBillingDetailModalComponent.
   * @param {MatDialogRef<OrderBillingDetailModalComponent>} dialogRef
   * @param {*} data
   * @memberof OrderBillingDetailModalComponent
   */
  constructor(public dialogRef: MatDialogRef<OrderBillingDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = _.cloneDeep(data.order);
    this.user = data.user;

    // set empty data
    this.order = this.order || FAKE.FAKEORDERBILLING;
  }

  /**
   * Método para cerrar el modal
   * @memberof OrderBillingDetailModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
