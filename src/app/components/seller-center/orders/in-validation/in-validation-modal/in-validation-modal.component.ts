
/* 3rd party components */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from "lodash";

/* our own custom components */
import { OrderDevolutionsModel } from './../../../../shared/models/order';
import { User } from './../../../../shared/models/login.model';
import { FAKE } from '../../../../../core/utilities/fakeData.model';

/**
 * Component
 */
@Component({
  selector: 'app-in-validation-modal',
  templateUrl: './in-validation-modal.component.html',
  styleUrls: ['./in-validation-modal.component.scss']
})

/**
 * Componente
 */
export class InValidationModalComponent {

  // User information
  user: User;
  // Order information
  order: OrderDevolutionsModel;

  /**
   * Creates an instance of ProductPendingDevolutionModalComponent.
   * @param {MatDialogRef<ProductPendingDevolutionModalComponent>} dialogRef 
   * @param {*} data 
   * @memberof ProductPendingDevolutionModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<InValidationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list, ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.order = _.cloneDeep(data.order);
    this.user = data.user;

    this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
  }

  /**
   * Evento para cerrar el modal
   * @memberof ProductPendingDevolutionModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
