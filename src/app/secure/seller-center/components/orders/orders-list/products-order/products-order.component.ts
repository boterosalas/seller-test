/* 3rd party components */
import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {MatTableDataSource, MatDialog} from '@angular/material';

/* our own custom components */
import {ProductDetailModalComponent} from '../product-detail-modal/product-detail-modal.component';
import {OrdersListComponent} from '../orders-page/orders-list.component';
import { Const } from '../../../../../../shared/util/constants';
import { Order } from '../../../../../../shared/models/order';
import { User } from '../../../../../../shared/models/login.model';
import { Logger } from '../../../../utils/logger.service';

// log component
const log = new Logger('ProductOrderComponent');

/**
 * Component
 */
@Component({
  selector: 'app-products-order',
  templateUrl: './products-order.component.html',
  styleUrls: ['./products-order.component.scss'],
})

/**
 * Componente para visualizar la información del producto
 */
export class ProductsOrderComponent {


  // Constantes
  public const = Const;
  // Inputs pasados por el controlador padre
  @Input() order: Order = Const.EMPTYORDER;
  @Input() dataSource: any;
  @Input() user: User;

  /**
   * Creates an instance of ProductsOrderComponent.
   * @param {MatDialog} dialog
   * @param {OrdersListComponent} orderComponet
   * @memberof ProductsOrderComponent
   */
  constructor(
    public dialog: MatDialog,
    public orderComponet: OrdersListComponent) {
  }


  /**
   * Funcionalidad para validar los check asociados a un productos.
   * @param {Order} item
   * @memberof ProductsOrderComponent
   */
  validateCheckProductForSendAll(item: Order) {
    log.info('--validateCheckProductForSendAll');
    /* Encuentro en el objeto de la tabla actual la orden seleccionada */
    for (let index = 0; index < this.dataSource.data.length; index++) {
      if (this.dataSource.data[index].orderNumber === item.orderNumber) {

        for (let j = 0; j < this.dataSource.data[index].products.length; j++) {
          /*  si un elemento check esta en false, desactivo el boton enviar todo. */
          if (this.dataSource.data[index].products[j].checkProductToSend === false) {
            this.dataSource.data[index].sendAllProduct = false;
            log.info('Hay uno o mas checks sin seleccionar, no se activa el boton enviar todo');
          }

        }
        /* Luego de validar el estado false de los check, paso a validar el estado true para ver si el boton se puede activar o no. */
        this.validateAllCheckProducts(item);
      }
    }
  }

  /**
   * Funcionalidad para validar si todos los checks de un prodcutos estan seleccionados
   * @param {any} item
   * @memberof ProductsOrderComponent
   */
  validateAllCheckProducts(item) {

    /* si la variable isAllChecked no cambia a false, es por que se puede activar el boton enviar todo. */
    let isAllChecked = true;

    for (let j = 0; j < item.products.length; j++) {
      if (item.products[j].checkProductToSend !== true) {
        isAllChecked = false;
      }

    }

    /* si todos los check estan seleccionados, activo el boton enviar todo. */
    if (isAllChecked) {
      for (let index = 0; index < this.dataSource.data.length; index++) {
        if (this.dataSource.data[index].orderNumber === item.orderNumber) {
          this.dataSource.data[index].sendAllProduct = true;
        }
      }
    }
  }

  /**
   * Funcionalidad para seleccionar todos los productos de una orden
   * @param {any} item
   * @memberof ProductsOrderComponent
   */
  checkAllProductInOrder(item) {

    for (let index = 0; index < this.dataSource.data.length; index++) {
      if (this.dataSource.data[index].orderNumber === item.orderNumber) {
        if (this.dataSource.data[index].sendAllProduct === true) {
          for (let j = 0; j < this.dataSource.data[index].products.length; j++) {
            this.dataSource.data[index].products[j].checkProductToSend = false;
          }
          this.dataSource.data[index].sendAllProduct = false;
        } else {
          this.dataSource.data[index].sendAllProduct = true;

          for (let j = 0; j < this.dataSource.data[index].products.length; j++) {
            this.dataSource.data[index].products[j].checkProductToSend = true;
          }
        }
      }
    }
  }

  /**
   * Método para desplegar el modal de visualización de detalle de un producto
   * @param {any} item
   * @memberof ProductsOrderComponent
   */
  openModalDetailProduct(item): void {
    const dialogRef = this.dialog.open(ProductDetailModalComponent, {
      data: {
        user: this.user,
        product: item
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail product was closed');
    });
  }

  /**
   * Método para desplegar el modal de envió de orden.
   * @param {any} order
   * @param {any} [product]
   * @memberof ProductsOrderComponent
   */
  openDialogSendOrder(order, product?) {
    if (product === true) {
      order.sendAllProduct = false;
    }
    this.orderComponet.openDialogSendOrder(order);
  }

}
