/* 3rd party components */
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';


/* our own custom components */
import { ComponentsService } from '../../../utils/services/common/components/components.service';
import { User } from '../../../../../shared/models/login.model';
import { UserService } from '../../../utils/services/common/user/user.service';
import { Logger } from '../../../utils/logger.service';
import { OrderBillingDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { Billing, Order, SearchFormEntity, InformationToForm } from '../../../../../shared/models/order';
import { ShellComponent } from '../../../shell/shell.component';
import { environment } from '../../../../../environments/environment';
import { BillingService } from '../billing.service';






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
export class BillingComponent implements OnInit, OnDestroy {

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
  // varialbe que almacena el número de ordenes obtenidas
  public orderListLength = false;
  // Información del usuario
  public user: User;
  // suscriptions vars
  private subFilterOrderBilling: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Facturación',
    title_for_search: 'Consultar ordenes',
    btn_title: 'Consultar ordenes',
    type_form: 'billing',
    information: new InformationToForm
  };
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
    public userService: UserService,
    public dialog: MatDialog,
    public billinService: BillingService,
    public component: ComponentsService,
    public shellComponent: ShellComponent
  ) {
  }

  /**
   * @memberof BillingComponent
   */
  ngOnInit() {
    this.getDataUser();
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
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de ordenes en la opcion search-order-menu
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {

    this.subFilterOrderBilling = this.shellComponent.eventEmitterOrders.filterBillingList.subscribe(
      (data: any) => {
        log.info(data);
        // log.info("Aplicando resultados obtenidos por el filtro")
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
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   * @memberof BillingComponent
   */
  getDataUser() {
    this.user = this.userService.getUser();
    if (this.user.login === undefined) {
      this.userService.setUser([]);
    }
  }


  /**
   * Funcionalidad para consultar la lista de devoluciones pendientes
   * @param {any} $event
   * @memberof BillingComponent
   */
  getOrdersList($event) {

    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `?idSeller=${this.user[environment.webUrl].sellerId}&limit=${$event.lengthOrder}`;

    this.billinService.getBilling(this.user, stringSearch).subscribe((res: any) => {
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
      log.info(res);
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
    }, err => {
      this.orderListLength = true;
      log.info(this.dataSource);
    });
  }

  /**
   * Método para cambiar el page size de la tabla ordenes
   * @param {any} pageSize
   * @memberof BillingComponent
   */
  changeSizeOrderTable($event) {
    log.info($event);
    this.dataSource.paginator = $event.paginator;
  }

}
