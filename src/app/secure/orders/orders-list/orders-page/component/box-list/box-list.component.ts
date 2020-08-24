import { Component, OnInit, ContentChildren, Input, Output, EventEmitter } from '@angular/core';
import { Const, ComponentsService } from '@app/shared';
import { OrderService } from '../../../orders.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent implements OnInit {

  // @ContentChildren(ContentDropDownBoxDirective)
  // items: QueryList<ContentDropDownBoxDirective>;

  public const = Const;

  @Input() isOpen: boolean;

  @Input() data: any;

  @Input() read;

  @Input() index;

  @Input() isInternational;

  @Input() arrayPermission;

  @Output() opened = new EventEmitter();

  @Output() showDetail = new EventEmitter();



  panelOpenState = false;
  hideStatus: any;


  constructor(
    private orderService: OrderService,
    private languageService: TranslateService,
    public componentService: ComponentsService,
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

}
