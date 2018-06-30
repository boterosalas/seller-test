/* 3rd party components */
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';

/* our own custom components */
import { ProductDetailBillingModalComponent } from './../product-detail-modal/product-detail-modal.component';
import { User } from './../../../shared/models/login.model';
import { Order } from './../../../shared/models/order';
import { Logger } from '../../../../core/utilities/logger.service';
import { Const } from '../../../shared/util/constants';
import { FAKE } from '../../../../core/utilities/fakeData.model';


// log component
const log = new Logger('BillingProductsOrderComponent');

/**
 * Component
 */
@Component({
  selector: 'app-billing-products-order',
  templateUrl: './billing-products-order.component.html',
  styleUrls: ['./billing-products-order.component.scss'],
})

/**
 * Componente para visualizar la información del producto
 */
export class BillingProductsOrderComponent {




  // Inputs pasados por el controlador padre
  @Input() order: any;

  /**
   * Creates an instance of BillingProductsOrderComponent.
   * @param {MatDialog} dialog 
   * @memberof BillingProductsOrderComponent
   */
  constructor(
    public dialog: MatDialog
  ) {
    this.order = this.order || FAKE.FAKEORDERBILLING;
  }

  /**
   * Método para desplegar el modal de visualización de detalle de un producto
   * @param {any} item 
   * @memberof BillingProductsOrderComponent
   */
  openModalDetailProduct(item): void {
    let dialogRef = this.dialog.open(ProductDetailBillingModalComponent, {
      data: {
        product: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail product was closed');
    });
  }
}
