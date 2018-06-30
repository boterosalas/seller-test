/* 3rd party components */

import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// Load the full build.
import * as _ from 'lodash';

/* our own custom components */
import {User} from '../../../../shared/models/login.model';
import {Order} from '../../../../shared/models/order';
import {FAKE} from '../../../../../core/utilities/fakeData.model';

/** Component */
@Component({
  selector: 'app-order-detail-modal',
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss']
})

/** Componente para visualizar el detalle de la información de la orden */
export class OrderDetailModalComponent {

  // User information
  user: User;
  // Order information
  order: Order;

  /**
   * Creates an instance of OrderDetailModalComponent.
   * @param {MatDialogRef<OrderDetailModalComponent>} dialogRef
   * @param {*} data
   * @memberof OrderDetailModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<OrderDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.order = _.cloneDeep(data.order);
    this.user = data.user;
    this.order = this.order || FAKE.FAKEORDER;
  }

  /**
   * Método para cerrar el modal
   * @memberof OrderDetailModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
