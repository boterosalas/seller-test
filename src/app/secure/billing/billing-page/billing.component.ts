import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Logger, UserParametersService, UserLoginService, LoadingService } from '@app/core';
import { Billing, ComponentsService, Const, InformationToForm, Order, SearchFormEntity, UserInformation } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { BillingService } from '../billing.service';
import { OrderBillingDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';

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
    'iva',
    'valueToPay',
    'detailOrder'
  ];
  //permiso de descarga
  downloadPermission: boolean;
  //  Creo el elemento que se empleara para la tabla
  public dataSource: MatTableDataSource<Billing>;
  // Creo el elemento que permite añadir el check a la tabla
  public selection = new SelectionModel<Order>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // varialbe que almacena el número de órdenes obtenidas
  public orderListLength = false;
  // Información del usuario
  public user: UserInformation;
  // suscriptions vars
  private subFilterOrderBilling: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Facturación',
    title_for_search: 'Consultar pagos',
    btn_title: 'Consultar pagos',
    type_form: 'billing',
    information: new InformationToForm
  };

  public iva = (100 / 19);

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
    private userParams: UserParametersService,
    public router?: Router,
    public userService?: UserLoginService,
    private loadingService?: LoadingService,
  ) { }

  /**
   * @memberof BillingComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.getDataUser();

    // remove storage from export billing pay when refresh page

    if ( performance.navigation.type == 1) {
      localStorage.removeItem('currentFilterBillingPay');
    }

  }

  async getDataUser() {
    this.user =  !!this.user ? this.user : await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
  }

   /**
    * @method getUserData
    * @description Método que carga los datos del vendedor para obtener la sellerId.
    * @memberof DashboardComponent
    */
   public async getUserData() {
    this.user =  !!this.user ? this.user : await this.userParams.getUserData();

    if (this.user.sellerProfile !== 'seller') {
        this.router.navigate([`/${RoutesConst.securehome}`]);
    } else {
        // this.getOrdersList(Event);
        // this.getLastSales();
    }
  }

  /**
   * Funcionalidad para remover las suscripciones creadas.
   * @memberof BillingComponent
   */
  ngOnDestroy() {
    // this.subFilterOrderBilling.unsubscribe();
      localStorage.removeItem('currentFilterBillingPay');
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
  openModalDetailOrder(item: any): void {
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
    this.loadingService.viewSpinner();
    this.subFilterOrderBilling = this.shellComponent.eventEmitterOrders.filterBillingList.subscribe(
      (data: any) => {
        this.loadingService.closeSpinner();
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
  getOrdersList($event: any) {

    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `?idSeller=${this.user.sellerId}&limit=${$event.lengthOrder}`;
    this.loadingService.viewSpinner();
    this.billinService.getBilling(this.user, stringSearch).subscribe((res) => {
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
      this.loadingService.closeSpinner();
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
    }, err => {
      this.loadingService.closeSpinner();
      this.orderListLength = true;
    });
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   * @param {any} pageSize
   * @memberof BillingComponent
   */
  changeSizeOrderTable($event: any) {
    this.dataSource.paginator = $event.paginator;
  }

  /* tslint:disable-next-line:jsdoc-format
    * @method isLoggedIn
    * @description Metodo para validar si el usuario esta logeado
    * @param message
    * @param isLoggedIn
    * @memberof DashboardComponent
    */
   public isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
        // this.router.navigate([`/${RoutesConst.home}`]);
    } else {
        this.getUserData();
    }
}

}
