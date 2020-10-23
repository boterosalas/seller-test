/* 3rd party components */
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';

/* our own custom components */
import { ProductDetailBillingModalComponent } from '../product-detail-modal/product-detail-modal.component';
import { FAKE } from '@app/shared';
import { Logger } from '@app/core';


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
    const dialogRef = this.dialog.open(ProductDetailBillingModalComponent, {
      data: {
        product: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail product was closed');
    });
  }
}
