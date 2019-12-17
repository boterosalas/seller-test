/* 3rd party components */
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as _ from 'lodash';
/* our own custom components */
import { OrderDevolutionsModel, FAKE } from '@app/shared';


@Component({
  selector: 'app-product-pending-devolution-modal',
  templateUrl: './product-pending-devolution-modal.component.html',
  styleUrls: ['./product-pending-devolution-modal.component.scss']
})


export class ProductPendingDevolutionModalComponent {

  // User information
  public user: any;
  // Order information
  public order: OrderDevolutionsModel;

  public showMessage= false;

  /**
   * Creates an instance of ProductPendingDevolutionModalComponent.
   * @param {MatDialogRef<ProductPendingDevolutionModalComponent>} dialogRef
   * @param {*} data
   * @memberof ProductPendingDevolutionModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ProductPendingDevolutionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list, ya que al usar
    // el mimso json estaba presentando cambios en ambas vistas
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

  cloudDownload(urlDownload: string) {
    if (urlDownload !== null && urlDownload !== undefined && urlDownload !== '') {
      window.open(urlDownload, 'to_download', 'height=200,width=700,left=300,location=yes,menubar=no,resizable=no,scrollbars=yes,status=no,titlebar=yes,top=300');
    } else {
      this.showMessage = true;
    }
  }
}
