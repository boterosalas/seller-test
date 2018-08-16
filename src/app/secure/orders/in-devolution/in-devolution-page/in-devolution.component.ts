import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Callback,
  ComponentsService,
  Const,
  ListReasonRejectionResponseEntity,
  Logger,
  OrderDevolutionsModel,
  Pending,
  SearchFormEntity,
  UserParametersService,
  UserService,
} from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { ActionConfirmReceiptComponent } from '../action-confirm-receipt/action-confirm-receipt.component';
import { ActionReportNoveltyComponent } from '../action-report-novelty/action-report-novelty.component';
import { InDevolutionService } from '../in-devolution.service';
import { ProductDevolutionModalComponent } from '../product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from '../view-comment/view-comment.component';

// log component
const log = new Logger('InDevolutionComponent');

/**
 * Component para visualizar las órdenes en devolucion
 */
@Component({
  selector: 'app-in-devolution',
  templateUrl: './in-devolution.component.html',
  styleUrls: ['./in-devolution.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class InDevolutionComponent implements OnInit, OnDestroy, Callback {

  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    // 'select',
    'orderNumber',
    'orderDate',
    'creationDate',
    'reversionRequestReason',
    'comment',
    'detailOrder'
  ];
  // Creo el elemento que se empleara para la tabla
  public dataSource: MatTableDataSource<any>;
  // Creo el elemento check para la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Variable que almacena el número de órdenes
  public orderListLength = false;
  // user info
  public user: any;
  // suscriptions vars
  private subFilterOrderPending: any;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;
  // Variable que almacena el objeto de paginación actual para listar las órdenes.
  currentEventPaginate: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'En Devolución',
    title_for_search: 'Consultar solicitudes',
    btn_title: 'Consultar solicitudes',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusInDevolution
    }
  };

  constructor(
    public shellComponent: ShellComponent,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private zone: NgZone,
    private inDevolutionService: InDevolutionService,
    public userService: UserService,
    private componentsService: ComponentsService,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  ngOnInit() {
    // Datos del usuario autenticado.
    this.userParams.getUserData(this);
  }

  callback() { }

  callbackWithParam(userData: any) {
    this.user = userData;
    // obtengo las órdenes con la función del componente ToolbarOptionsComponent
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
    this.getReasonsRejection();
  }

  ngOnDestroy() {
    // Remover las suscripciones creadas.
    // this.subOrderList.unsubscribe();
    this.subFilterOrderPending.unsubscribe();
  }

  /**
   * Otener los resultados obtenidos al momento de realizar
   * el filtro de órdenes en la opcion search-order-menu.
   * 
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {
    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.filterOrdersWithStatus.subscribe(
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
   * Método para cambiar el page size de la tabla órdenes.
   *
   * @param {*} $event
   * @memberof InDevolutionComponent
   */
  changeSizeOrderTable($event) {
    log.info($event);
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden.
   * 
   * @param item
   */
  openModalCommentOrder(item): void {
    const dialogRef = this.dialog.open(ViewCommentComponent, {
      width: '50%',
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal comment order was closed');
    });
  }

  /**
   * Método para obtener la lista de órdenes.
   * 
   * @param {any} $event
   * @memberof InDevolutionComponent
   */
  getOrdersList($event) {
    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `idSeller=${this.user.sellerId}
    &limit=${$event.lengthOrder}&reversionRequestStatusId=${Const.StatusInDevolution}`;

    this.inDevolutionService.getOrders(stringSearch).subscribe((res: any) => {
      // guardo el filtro actual para la paginación.
      this.currentEventPaginate = $event;
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
      log.error('No se pudo cargar las órdenes');
    });
  }


  /**
   * Si la cantidad de elementos seleccionados coincide con el número total de filas.
   *
   * @returns {boolean}
   * @memberof InDevolutionComponent
   */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selecciona todas las filas si no están todos los seleccionados;
   * de lo contrario, borrar selección.
   * 
   * @memberof InDevolutionComponent
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Filtro para la tabla.
   * 
   * @param {string} filterValue
   * @memberof InDevolutionComponent
   */
  applyFilter(filterValue: string) {
    // Eliminar el espacio en blanco.
    filterValue = filterValue.trim();
    // Datasource se predetermina a minúsculas.
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  /**
   * Método para desplegar el modal de detalle de la orden.
   * 
   * @param {any} item
   * @memberof InDevolutionComponent
   */
  openModalDetailOrder(item): void {
    const dialogRef = this.dialog.open(ProductDevolutionModalComponent, {
      data: {
        user: this.user,
        order: item
      },
    });
  }

  /**
   * Método para desplegar el modal de confirmaición.
   * 
   * @param {any} item
   * @memberof InDevolutionComponent
   */
  openModalConfirmReceipt(order: OrderDevolutionsModel): void {
    // Json para realizar el envio, IsAcceptanceRequest: true se emplea para aceptar la solicitud.
    const information = {
      IsAcceptanceRequest: true,
      Id: order.id
    };
    this.inDevolutionService.reportNovelty(information).subscribe(res => {
      log.info(res);
      if (res) {
        this.getOrdersList(this.currentEventPaginate);
        this.dialogAcceptDevolution();
      } else {
        this.componentsService.openSnackBar('Se ha presentado un error al aceptar la solicitud.', 'Aceptar', 12000);
      }
    }, error => {
      log.error(error);
      this.componentsService.openSnackBar('Se ha presentado un error al aceptar la solicitud.', 'Aceptar', 12000);
    });
  }

  /**
   * Método para desplegar el modal de confirmación.
   * 
   * @memberof InDevolutionComponent
   */
  dialogAcceptDevolution() {
    const dialogRef = this.dialog.open(ActionConfirmReceiptComponent, {
      width: '300px',
      data: {
        user: this.user
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  /**
    * Método para desplegar el modal de report novedad.
    * 
    * @param {OrderDevolutionsModel} item
    * @memberof InDevolutionComponent
    */
  openModalReportNovelty(item: OrderDevolutionsModel): void {
    const dialogRef = this.dialog.open(ActionReportNoveltyComponent, {
      width: '50%',
      data: {
        user: this.user,
        order: item,
        reasonRejection: this.reasonRejection
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.getOrdersList(this.currentEventPaginate);
      }
      log.info('The modal detail order was closed');
      log.info(result);
    });
  }

  /**
   * Método para obtener la lista de opciones para realizar el rechazo de una solicitud de devolución.
   * 
   * @memberof InDevolutionComponent
   */
  getReasonsRejection() {
    this.inDevolutionService.getReasonsRejection().subscribe((res: Array<ListReasonRejectionResponseEntity>) => {
      this.reasonRejection = res;
    });
  }

} // End class


