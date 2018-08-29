
/* 3rd party components */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as _ from 'lodash';

/* our own custom components */
import { OrderDevolutionsModel, FAKE } from '@app/shared';

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
  public user: any;
  // Order information
  public order: OrderDevolutionsModel;

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
