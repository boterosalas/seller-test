import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';

import { ShellComponent } from '@core/shell/shell.component';
import {
  Logger,
  ComponentsService,
  UserService,
  Callback,
  UserParametersService,
  Billing,
  InformationToForm,
  Order,
  SearchFormEntity,
  Const
} from '@app/shared';
import { BillingService } from '../billing.service';
import { OrderBillingDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';

// log component
const log = new Logger('BillingComponent');

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BillingComponent implements OnInit, OnDestroy, Callback {

  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'expand',
    'bill',
    'numberOrder',
    'orderPayment',
    'concept',
    'paymentDate',
    'commission',
    'valueToPay',
    'detailOrder'
  ];
  //  Creo el elemento que se empleara para la tabla
  public dataSource: MatTableDataSource<Billing>;
  // Creo el elemento que permite añadir el check a la tabla
  public selection = new SelectionModel<Order>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // varialbe que almacena el número de órdenes obtenidas
  public orderListLength = false;
  // Información del usuario
  public user: any;
  // suscriptions vars
  private subFilterOrderBilling: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Facturación',
    title_for_search: 'Consultar órdenes',
    btn_title: 'Consultar órdenes',
    type_form: 'billing',
    information: new InformationToForm
  };
  // Conceptos de facturación.
  public billingConcepts = Const.BILLING_CONCEPTS;
  // Método que permite crear la fila de detalle de la tabla
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

  /**
   * Creates an instance of BillingComponent.
   * @param userService
   * @param {MatDialog} dialog
   * @param {BillingService} billinService
   * @param {ComponentsService} component
   * @param {ShellComponent} shellComponent
   * @memberof BillingComponent
   */
  constructor(
    public dialog: MatDialog,
    public billinService: BillingService,
    public component: ComponentsService,
    public shellComponent: ShellComponent,
    private userParams: UserParametersService
  ) {
    this.user = {};
  }

  /**
   * @memberof BillingComponent
   */
  ngOnInit() {
    this.getDataUser();
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
    // obtengo las ordenes con la función del componente ToolbarOptionsComponent
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
  }

  /**
   * Funcionalidad para remover las suscripciones creadas.
   * @memberof BillingComponent
   */
  ngOnDestroy() {
    // this.subOrderList.unsubscribe();
    this.subFilterOrderBilling.unsubscribe();
  }

  /**
   * Funcionalidad para cancelar los propagation .
   * @param {Event} event
   * @memberof BillingComponent
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Funcionalidad para despelgar el modal para visualizar el detalle de una orden.
   * @param {any} item
   * @memberof BillingComponent
   */
  openModalDetailOrder(item): void {
    const dialogRef = this.dialog.open(OrderBillingDetailModalComponent, {
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal OrderDetailModalComponent was closed');
    });
  }

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar 
   * el filtro de órdenes en la opcion search-order-menu.
   * 
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {

    this.subFilterOrderBilling = this.shellComponent.eventEmitterOrders.filterBillingList.subscribe(
      (data: any) => {
        if (data != null) {
          if (data.length === 0) {
            this.orderListLength = true;
          } else {
            this.orderListLength = false;
          }
          this.dataSource = new MatTableDataSource(data);

          const paginator = this.toolbarOption.getPaginator();
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.numberElements = this.dataSource.data.length;
        }
      });
  }

  /**
   * Funcionalidad para consultar la lista de devoluciones pendientes.
   * 
   * @param {any} $event
   * @memberof BillingComponent
   */
  getOrdersList($event) {

    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `?idSeller=${this.user.sellerId}&limit=${$event.lengthOrder}`;

    this.billinService.getBilling(this.user, stringSearch).subscribe((res) => {
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
    }, err => {
      this.orderListLength = true;
    });
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   * @param {any} pageSize
   * @memberof BillingComponent
   */
  changeSizeOrderTable($event) {
    this.dataSource.paginator = $event.paginator;
  }

}
