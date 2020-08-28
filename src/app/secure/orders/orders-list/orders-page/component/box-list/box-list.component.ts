import { Component, OnInit, ContentChildren, Input, Output, EventEmitter, QueryList } from '@angular/core';
import { Const, ComponentsService, Order, UserInformation } from '@app/shared';
import { OrderService } from '../../../orders.service';
import { TranslateService } from '@ngx-translate/core';
import { ContentDropDownDetailOrderDirective } from './content-drop-down-detail-order.directive';
import { LoadingService, ModalService } from '@app/core';
import { MatDialog } from '@angular/material';
import { SendOrderComponent } from '../../../send-order/send-order.component';
import { OrderDetailModalComponent } from '../../../order-detail-modal/order-detail-modal.component';
import { LoadFileComponent } from '@app/shared/components/load-file/load-file';

@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent implements OnInit {

  @ContentChildren(ContentDropDownDetailOrderDirective)
  items: QueryList<ContentDropDownDetailOrderDirective>;



  @Input() isOpen: boolean;

  @Input() data: any;

  @Input() read;

  @Input() index;

  @Input() user;

  @Input() typeProfile;

  @Input() isInternational;

  @Input() arrayPermission;

  @Output() opened = new EventEmitter();

  @Output() showDetail = new EventEmitter();

  public const = Const;



  panelOpenState = false;
  hideStatus: any;


  constructor(
    private orderService: OrderService,
    private languageService: TranslateService,
    public componentService: ComponentsService,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    public modalService: ModalService,
  ) { }

  ngOnInit() {
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Método para marcar una orden y actualizar el registro mediante un servicio web
   * @param {any} orderId
   * @param {any} currentValue
   * @memberof OrdersListComponent
   */

  recordProcesSedOrder(orderId: any, currentValue: any, idSeller: number) {

    const closeSnack = this.languageService.instant('actions.close');
    if (currentValue === true) {
      currentValue = false;
    } else {
      currentValue = true;
    }
    const data = {
      idOrder: orderId,
      value: currentValue,
      SellerId: idSeller
    };
    this.orderService.recordProcesSedOrder(data)
      .subscribe((result: any) => {
        if (result.status === 200) {
          this.data.processedOrder = currentValue;
          if (currentValue) {
            const message = this.languageService.instant('secure.orders.order_list.order_page.successfully_mark');
            this.componentService.openSnackBar(message, closeSnack, 10000);

          } else {
            const message = this.languageService.instant('secure.orders.order_list.order_page.successfully_remove_mark');
            this.componentService.openSnackBar(message, closeSnack, 10000);
          }
        }
      });
  }

  public getDateWithOutGMT(date: any): any {
    const timezone = new Date().getTimezoneOffset();
    const time = new Date(date).getTime();
    return new Date(time + (timezone * 60 * 1000));
  }


  /**
   * Método que retorna el número de elementos a ser enviados en una orden
   * @returns
   * @memberof SendOrderComponent
   */
  getLengthProductForSend(order: Order) {
    let numberElements = 0;
    for (let i = 0; i < order.products.length; i++) {
      if (order.products[i].tracking == null) {
        numberElements += 1;
      }
    }
    if (numberElements === 0) {
      const message = this.languageService.instant('secure.orders.order_list.order_page.info_no_more_products');
    } else {
      const message = this.languageService.instant('secure.orders.order_list.order_page.info_total_products');
    }
    return numberElements;
  }

  /**
   * Funcionalidad para desplegar el modal que permite hacer el envío de todos los productos de una orden.
   * @param {any} item
   * @memberof OrdersListComponent
   */
  openDialogSendOrder(item: any): void {
    const closeSnack = this.languageService.instant('actions.close');
    if (this.getLengthProductForSend(item) === 0) {
      const message = this.languageService.instant('secure.orders.order_list.order_page.no_pending_products');
      this.componentService.openSnackBar(message, closeSnack, 3000);
    } else {
      this.loadingService.viewProgressBar();
      const dialogRef = this.dialog.open(SendOrderComponent, {
        width: '95%',
        data: {
          user: this.user,
          order: item
        },
        panelClass: 'full-width-dialog'

      });
      dialogRef.afterClosed().subscribe(result => {
        if (result !== false) {} else {
          const message = this.languageService.instant('secure.orders.order_list.order_page.info_no_send_products');
        }
        this.loadingService.closeProgressBar();
      });
    }
  }

  /**
   * Funcionalidad para despelgar el modal para visualizar el detalle de una orden.
   * @param {any} item
   * @memberof OrdersListComponent
   */
  openModalDetailOrder(item: any): void {
    const dialogRef = this.dialog.open(OrderDetailModalComponent, {
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }


  /**
   * Descargar rotulos en ordenes estado asignado
   * @param {*} param
   * @memberof OrdersListComponent
   */
  public downloadLabel(param: any) {
    this.loadingService.viewSpinner();
    const orderNumber = +param.orderNumber;
    this.orderService.getDownlaodLabel(orderNumber).subscribe((res: any) => {
      if (res.status === 200 || res.status === 201) {
        if (res.body && res.body.data) {
          window.open(res.body.data, '_blank');
        } else {
          this.modalService.showModal('errorService');
        }
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    }, error => {
      this.loadingService.closeSpinner();
      this.componentService.openSnackBar(error.error.errors[0].message,
        this.languageService.instant('actions.close'), 4000);
    });
  }

  /**
   * Abre el dialogo para carar un archivo, dependiendo del tipo
   *
   * @param {*} body
   * @memberof BoxListComponent
   */
  public openLoadFile(body: any): void {
    if (!body.billUrl) {
      const dialogRef = this.dialog.open(LoadFileComponent, {
        width: '60%',
        minWidth: '300px',
        disableClose: true,
        data: { type: 'PDF', body: body }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          body.billUrl = result;
        }
      });
    }
  }

}
