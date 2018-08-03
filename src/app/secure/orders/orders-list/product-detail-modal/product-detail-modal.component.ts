/* 3rd party components */
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// Load the full build.
import * as _ from 'lodash';

/* our own custom components */
import { FAKE, ProductsEntity } from '@app/shared';


/** Component */
@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})

/**
 * Componente para visualizar la información de los productos
 */
export class ProductDetailModalComponent {
  // User information
  public user: any;
  // Producto information
  product: ProductsEntity;

  /**
   * Creates an instance of ProductDetailModalComponent.
   * @param {MatDialogRef<ProductDetailModalComponent>} dialogRef
   * @param {*} data
   * @memberof ProductDetailModalComponent
   */
  constructor(
    public dialogRef: MatDialogRef<ProductDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // _.cloneDeep permite clonar el json y no generar error de binding en la vista orders-list,
    // ya que al usar el mimso json estaba presentando cambios en ambas vistas
    this.product = _.cloneDeep(data.product);
    this.user = data.user;

    this.product = this.product || FAKE.FAKEORDER.products[0];

  }

  /**
   * Método para cerrar el modal
   * @memberof ProductDetailModalComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
