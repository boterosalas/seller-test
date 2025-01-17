import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FAKE, OrderDevolutionsModel, UserInformation } from '@app/shared';
import * as _ from 'lodash';

// Load the full build.
/**
 * Component
 */
@Component({
  selector: 'app-product-devolution-modal',
  templateUrl: './product-devolution-modal.component.html',
  styleUrls: ['./product-devolution-modal.component.scss']
})

/**
 * Componente para realizar la visualiazación de la información de una devolución
 */
export class ProductDevolutionModalComponent {

  // Información del usuario
  user: UserInformation;
  // Información de la orden
  order: OrderDevolutionsModel;

  public showMessage= false;

  /**
   * Creates an instance of ProductDevolutionModalComponent.
   * @param {MatDialogRef<ProductDevolutionModalComponent>} dialogRef
   * @param {*} data
   * @memberof ProductDevolutionModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ProductDevolutionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.order = _.cloneDeep(data.order);
    this.user = data.user;
    this.order = this.order || FAKE.FAKEPENDINGDEVOLUTION;
  }

  /**
   * Evento para cerrar el modal
   * @memberof ProductDevolutionModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  cloudDownload(urlDownload: any) {
    if (urlDownload && urlDownload.length > 0) {
      urlDownload.forEach(element => {
        window.open(element);
      });
    } else {
      this.showMessage = true;
    }
  }
}
