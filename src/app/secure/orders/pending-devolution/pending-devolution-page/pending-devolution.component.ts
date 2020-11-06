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
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { TranslateService } from '@ngx-translate/core';

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
  //
  public subFilterOrder: any;
  // Método para el check de la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Número de órdenes
  public orderListLength = false;
  // user info
  public user: UserInformation;
  //
  lengthOrder = 0;
  public pageSize = 50;
  isClear = false;
  // suscriptions vars
  private subFilterOrderPending: any;
  public searchSubscription: any;
  // Variable que almacena el objeto de paginación actual para listar las órdenes.
  currentEventPaginate: any;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'menu.Devoluciones',
    subtitle: 'secure.orders.list-cancels.tab1',
    btn_title: 'secure.orders.filter.title_filter',
    title_for_search: 'secure.orders.filter.title_filter',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusPendingCancels
    },
    count: ''
  };
  // Variables con los permisos que este componente posee.
  permissionComponent: MenuModel;
  read = readFunctionality;
  accept = acceptFuncionality;
  refuse = refuseFuncionality;
  readPermission: boolean;
  acceptPermission: boolean;
  refusePermission: boolean;
  typeProfile: number;

  public length = 0;
  public idSeller = '';
  public event: any;
  public paginationToken = '{}';
  public params: any;
  public onlyOne = true;
  public onlyOneCall = true;
  public call = true;
  public positionPagination: any;
  public arrayPosition = [];
  public listOrdens: any;
  public dateOrderInitial = '';
  public dateOrderFinal = '';
  public idChannel = '';
  public orderNumber = '';
  public identificationCard = '';
  public processedOrder = '';
  public lastState: number;
  public querySearch = '';
  public currentLanguage: string;

  hideOptionsListCancel: Boolean = true;

  constructor(
    public shellComponent: ShellComponent,
    public dialog: MatDialog,
    private pendingDevolutionService: PendingDevolutionService,
    public componentsService: ComponentsService,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    private authService: AuthService,
    public eventsSeller: EventEmitterSeller,
    private languageService: TranslateService,
  ) { }

  /**
   * ngOnInit
   * @memberof PendingDevolutionComponent
   */
  ngOnInit() {
    this.hideOptionsListCancel = true;
    this.getDataUser(pendingName);
    this.searchSubscription = this.eventsSeller.eventSearchSeller
      .subscribe((seller: StoreModel) => {
        this.idSeller = seller.IdSeller;
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'callOne': true,
          'lengthOrder': 100
        };
        this.getOrdersList(paramsArray);
      });
    this.clearTable();
  }

  ngOnDestroy() {
    // Funcionalidad para remover las suscripciones creadas.
    this.subFilterOrderPending.unsubscribe();
  }

  /**
   * MEthod that get the permissions for the component
   */

  async getDataUser(nameMenu: string) {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 1);
      this.setPermission(1);
    }
    this.getOrdersListSinceFilterSearchOrder();
    this.getReasonsRejection();
    this.changeLanguage();
  }

  /**
   * funcion para escuchar el evento al cambiar de idioma
   *
   * @memberof PendingDevolutionComponent
   */
  changeLanguage() {
    if (localStorage.getItem('culture_current') !== 'US') {
      this.currentLanguage = 'ES';
      localStorage.setItem('culture_current', 'ES');
    } else {
      this.currentLanguage = 'US';
      localStorage.setItem('culture_current', 'US');
    }
    this.languageService.onLangChange.subscribe((e: Event) => {
      localStorage.setItem('culture_current', e['lang']);
      this.getOrdersList(this.event);
      this.getReasonsRejection();
    });
  }

  setPermission(typeProfile: number) {
    // Permisos del componente.
    this.typeProfile = typeProfile;
    this.readPermission = this.getFunctionality(this.read);
    this.acceptPermission = this.getFunctionality(this.accept);
    this.refusePermission = this.getFunctionality(this.refuse);
  }

  public getFunctionality(functionality: string): boolean {
    if (this.permissionComponent) {
      const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
      return permission && permission.ShowFunctionality;
    } else {
      return null;
    }

  }
  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de órdenes en la opcion search-order-menu
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {

    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.filterOrdersWithStatus.subscribe(
      (data: any) => {
        if (data && data.count > 0) {
          this.dataSource = new MatTableDataSource(data.viewModel);
          this.lengthOrder = data.count;
          const paginator = this.toolbarOption.getPaginator();
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.orderListLength = false;
        } else {
          this.lengthOrder = data.count;
          this.dataSource = new MatTableDataSource(null);
          this.orderListLength = true;
        }
        if (data && data.filter) {
          this.dateOrderInitial = data.filter.dateOrderInitial;
          this.dateOrderFinal = data.filter.dateOrderFinal;
          this.idChannel = data.filter.idChannel;
          this.orderNumber = data.filter.orderNumber;
          this.identificationCard = data.filter.identificationCard;
          this.processedOrder = data.filter.processedOrder;
        }
      });
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  changeSizeOrderTable($event: any) {
    // this.pageSize = $event.pageSize;
    // this.dataSource.paginator = $event.paginator;
  }


  getOrdersList(params?: any) {
    this.loadingService.viewSpinner();
    this.isClear = false;
    this.params = this.setParameters(params);
    this.pendingDevolutionService.getOrders(this.params).subscribe((res: any) => {
      if (res && res.count > 0) {
        this.setTable(res);
        this.orderListLength = false;
        if (params && params.callOne) {
          this.lengthOrder = res.count;
          this.isClear = true;
        }
        this.loadingService.closeSpinner();
      } else {
        this.lengthOrder = 0;
        this.isClear = true;
        this.orderListLength = true;
        this.dataSource = new MatTableDataSource(null);
        this.loadingService.closeSpinner();
      }
    });
  }

  setParameters(params: any) {
    if (params && params.callOne) {
      this.paginationToken = '{}';
      this.arrayPosition = [];
    }
    if (params && params.clear) {
      this.dateOrderFinal = '';
      this.dateOrderInitial = '';
      this.orderNumber = '';
      this.identificationCard = '';
    }
    const paramsArray = {
      'limit': 'limit=' + this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken) + this.querySearch,
      'idSeller': this.idSeller,
      'dateOrderFinal': this.dateOrderFinal,
      'dateOrderInitial': this.dateOrderInitial,
      'orderNumber': this.orderNumber,
      'identificationCard': this.identificationCard,
      'reversionRequestStatusId': Const.StatusPendingCancels
    };
    return paramsArray;
  }

  /**
   * funcion para resetear la data
   *
   * @param {*} res
   * @memberof OrdersListComponent
   */
  setTable(res: any) {
    if (res) {
      if (this.onlyOne) {
        this.length = res.count;
        this.arrayPosition = [];
        this.arrayPosition.push('{}');
      }
      this.dataSource = new MatTableDataSource(res.viewModel);
      this.savePaginationToken(res.paginationToken);
    } else {
      this.clearTable();
    }
    this.onlyOne = false;
  }
  /**
   * funcion para salvar el token de la paginacion
   *
   * @param {string} paginationToken
   * @memberof OrdersListComponent
   */
  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }
  /**
   * limpiar el contador de la tabla
   *
   * @memberof OrdersListComponent
   */
  clearTable() {
    this.subFilterOrder = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
      (data: any) => {
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'callOne': true,
          'lengthOrder': 100,
          'clear': true
        };
        this.getOrdersList(paramsArray);
      });
  }
  /**
   * funcion que escucha el cambio de paginacion y el rango de busqueda
   *
   * @param {*} event
   * @memberof OrdersListComponent
   */
  paginations(event: any) {
    const index = event.paginator.pageIndex;
    if (event.paginator.pageSize !== this.pageSize) {
      this.pageSize = event.paginator.pageSize;
      if (this.arrayPosition && this.arrayPosition.length > 0) {
        this.arrayPosition = [];
        this.isClear = true;
      }
    } else {
      this.querySearch = '';
    }
    if (index === 0) {
      this.paginationToken = '{}';
    }
    const isExistInitial = this.arrayPosition.includes('{}');
    if (isExistInitial === false) {
      this.arrayPosition.push('{}');
    }
    const isExist = this.arrayPosition.includes(this.paginationToken);
    if (isExist === false) {
      this.arrayPosition.push(this.paginationToken);
    }

    this.paginationToken = this.arrayPosition[index];
    if (this.paginationToken === undefined) {
      this.paginationToken = '{}';
      this.isClear = true;
    }
    const params = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
      'idSeller': this.idSeller,
      'state': this.lastState,
      'dateOrderFinal': this.dateOrderFinal,
      'dateOrderInitial': this.dateOrderInitial
    };
    this.getOrdersList(params);
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
  openModalDetailOrder(item: any): void {
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
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'callOne': true,
          'lengthOrder': 100,
          'clear': true
        };
        this.getOrdersList(paramsArray);
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
  openModalCommentOrder(item: any): void {

    const dialogRef = this.dialog.open(ViewCommentComponent, {
      width: '50%',
      data: {
        user: this.user,
        order: item
      },
    });
    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      item.registryTranslations = val.registryTranslations;
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
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'callOne': true,
          'lengthOrder': 100,
          'clear': true
        };
        this.getOrdersList(paramsArray);
      }
      log.info('The modal detail order was closed');
    });
  }
}
