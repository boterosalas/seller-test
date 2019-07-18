import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Logger, UserParametersService } from '@app/core';
import {
  ComponentsService,
  Const,
  ListReasonRejectionResponseEntity,
  OrderDevolutionsModel,
  Pending,
  SearchFormEntity,
  UserInformation,
} from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';
import { isEmpty } from 'lodash';

import { ActionAcceptDevolutionComponent } from '../action-accept-devolution/action-accept-devolution.component';
import { ActionRefuseDevolutionComponent } from '../action-refuse-devolution/action-refuse-devolution.component';
import { PendingDevolutionService } from '../pending-devolution.service';
import {
  ProductPendingDevolutionModalComponent,
} from '../product-pending-devolution-modal/product-pending-devolution-modal.component';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { MenuModel, readFunctionality, acceptFuncionality, refuseFuncionality, pendingName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';

// log component
const log = new Logger('PendingDevolutionComponent');

/**
 * Component para visualizar las órdenes en estado pendiente de devolución
 */
@Component({
  selector: 'app-pending-devolution',
  templateUrl: './pending-devolution.component.html',
  styleUrls: ['./pending-devolution.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

/**
 * Componente
 */
export class PendingDevolutionComponent implements OnInit, OnDestroy {

  // Elemento paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    // 'select',
    // 'plus',
    'orderNumber',
    'orderDate',
    'creationDate',
    'maximumDeliveryDate',
    'reversionRequestReason',
    'comment',
    'detailOrder'
  ];
  // contendra la Información para la tabla
  public dataSource: MatTableDataSource<any>;
  // Método para el check de la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Número de órdenes
  public orderListLength = false;
  // user info
  public user: UserInformation;
  // suscriptions vars
  private subFilterOrderPending: any;
  // Variable que almacena el objeto de paginación actual para listar las órdenes.
  currentEventPaginate: any;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Órdenes',
    subtitle: 'Solicitudes pendientes',
    btn_title: 'Consultar solicitudes',
    title_for_search: 'Consultar solicitudes',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusPendingDevolution
    }
  };

  permissionComponent: MenuModel;

  /**
   * Attribute that represent the read access
   */
  read = readFunctionality;
  accept = acceptFuncionality;
  refuse = refuseFuncionality;

  constructor(
    public shellComponent: ShellComponent,
    public dialog: MatDialog,
    private pendingDevolutionService: PendingDevolutionService,
    public componentsService: ComponentsService,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  /**
   * ngOnInit
   * @memberof PendingDevolutionComponent
   */
  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(pendingName);
    this.getDataUser();
  }

  ngOnDestroy() {
    // Funcionalidad para remover las suscripciones creadas.
    this.subFilterOrderPending.unsubscribe();
  }

  /**
   * MEthod that get the permissions for the component
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
    this.getReasonsRejection();
  }

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de órdenes en la opcion search-order-menu
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {

    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.filterOrdersWithStatus.subscribe(
      (data: any) => {
        if (data != null) {
          this.orderListLength = data.length === 0;
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
   * Método para cambiar el page size de la tabla órdenes
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  changeSizeOrderTable($event) {
    this.dataSource.paginator = $event.paginator;
  }


  /**
   * Método para obtener la lista de órdenes.
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  getOrdersList($event) {
    if (!$event) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `limit=${$event.lengthOrder}&reversionRequestStatusId=${Const.StatusPendingDevolution}`;
    this.loadingService.viewSpinner();
    this.pendingDevolutionService.getOrders(stringSearch).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      // guardo el filtro actual para la paginación.
      this.currentEventPaginate = $event;
      if (isEmpty(res)) {
        this.orderListLength = res.length === 0;
      }
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
    }, () => {
      this.orderListLength = true;
      // log.error(this.dataSource);
    });
  }


  /**
   * Whether the number of selected elements matches the total number of rows.
   * @returns
   * @memberof PendingDevolutionComponent
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   * @memberof PendingDevolutionComponent
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Filtro para la tabla
   * @param {string} filterValue
   * @memberof PendingDevolutionComponent
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * Método para desplegar el modal de detallen de orden
   * @param {any} item
   * @memberof PendingDevolutionComponent
   */
  openModalDetailOrder(item): void {
    const dialogRef = this.dialog.open(ProductPendingDevolutionModalComponent, {
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método para desplegar el modal de confirmaición.
   *
   * @param {OrderDevolutionsModel} order
   * @memberof PendingDevolutionComponent
   */
  openModalAceptOrder(order: OrderDevolutionsModel): void {
    // Armo el json para realizar el envio, IsAcceptanceRequest: true se emplea para aceptar la solicitud
    const information = {
      IsAcceptanceRequest: true,
      Id: order.id
    };
    this.pendingDevolutionService.acceptOrDeniedDevolution(information).subscribe(res => {
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
   * Método para desplegar el modal para ver el comentario de la orden
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
    dialogRef.afterClosed().subscribe(() => {
      log.info('The modal comment order was closed');
    });
  }

  /**
   * Método para desplegar el modal de confirmación
   * @memberof InDevolutionComponent
   */
  dialogAcceptDevolution() {
    const dialogRef = this.dialog.open(ActionAcceptDevolutionComponent, {
      width: '300px',
      data: {
        user: this.user
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método para obtener la lista de opciones para realizar el rechazo de una solicitud de devolución
   * @memberof PendingDevolutionComponent
   */
  getReasonsRejection() {
    this.pendingDevolutionService.getReasonsRejection().subscribe((res: Array<ListReasonRejectionResponseEntity>) => {
      this.reasonRejection = res;
    });
  }

  /**
   * Método para desplegar el modal de report novelty
   * @param {OrderDevolutionsModel} item
   * @memberof PendingDevolutionComponent
   */
  openModalRefuseOrder(item: OrderDevolutionsModel): void {
    const dialogRef = this.dialog.open(ActionRefuseDevolutionComponent, {
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
    });
  }
}
