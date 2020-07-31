import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

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

import { ActionConfirmReceiptComponent } from '../action-confirm-receipt/action-confirm-receipt.component';
import { ActionReportNoveltyComponent } from '../action-report-novelty/action-report-novelty.component';
import { InDevolutionService } from '../in-devolution.service';
import { ProductDevolutionModalComponent } from '../product-devolution-modal/product-devolution-modal.component';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { MenuModel, readFunctionality, devolutionName, acceptFuncionality, refuseFuncionality, visualizeFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { TranslateService } from '@ngx-translate/core';

// log component
const log = new Logger('InDevolutionComponent');

/**
 * Component para visualizar las órdenes en devolucion
 */
@Component({
  selector: 'app-in-devolution',
  templateUrl: './in-devolution.component.html',
  styleUrls: ['./in-devolution.component.scss'],
  providers: [InDevolutionService],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class InDevolutionComponent implements OnInit, OnDestroy {

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

  private searchSubscription: any;
  // Creo el elemento que se empleara para la tabla
  public dataSource: MatTableDataSource<any>;
  // Creo el elemento check para la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Variable que almacena el número de órdenes
  public orderListLength = false;
  // user info
  public user: UserInformation;

  currentLanguage: string;

  // suscriptions vars
  private subFilterOrderPending: any;
  // Lista de opciones para realizar el rechazo de una solicitud
  public reasonRejection: Array<ListReasonRejectionResponseEntity>;
  // Variable que almacena el objeto de paginación actual para listar las órdenes.
  currentEventPaginate: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'secure.orders.orders',
    subtitle: 'menu.En devolución',
    title_for_search: 'secure.orders.filter.title_filter',
    btn_title: 'secure.orders.filter.title_filter',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusInDevolution
    },
    count: ''
  };

  permissionComponent: MenuModel;

  /**
   * Attribute that represent the read access
   */
  read = readFunctionality;
  accept = acceptFuncionality;
  refuse = refuseFuncionality;
  visualizeFunctionality = visualizeFunctionality;

  // Variables con los permisos que este componente posee.
  readPermission: boolean;
  acceptPermission: boolean;
  refusePermission: boolean;
  visualizePermission: boolean;
  showMenssage = false;
  typeProfile: number;
  idSeller: number;
  event: any;

  constructor(
    public shellComponent: ShellComponent,
    public dialog: MatDialog,
    private inDevolutionService: InDevolutionService,
    private componentsService: ComponentsService,
    private loadingService: LoadingService,
    public userParams: UserParametersService,
    private authService: AuthService,
    private languageService: TranslateService,
    public eventsSeller: EventEmitterSeller,
  ) { }

  ngOnInit() {
    this.getDataUser();
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      if (this.event) {
        this.getOrdersList(this.event);
        this.getReasonsRejection();
      }
    });
    this.clearData();
    this.changeLanguage();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.authService.getMenuProfiel(devolutionName, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(devolutionName, 1);
      this.setPermission(1);
    }
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
    this.getReasonsRejection();
  }
/**
 * funcion para escuchar el evento al cambiar de idioma
 *
 * @memberof InDevolutionComponent
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
    this.visualizePermission = this.getFunctionality(this.visualizeFunctionality);
  }

  clearData() {
    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
      (data: any) => {
        this.getOrdersList(this.event);
      });
  }

  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  ngOnDestroy() {
    // Remover las suscripciones creadas.
    this.subFilterOrderPending.unsubscribe();
    this.searchSubscription.unsubscribe();
  }


  /**
   * MEthod that get the permissions for the component
   */
  // public getFunctionality(functionality: string): boolean {
  //   const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
  //   return permission && permission.ShowFunctionality;
  // }

  /**
   * Otener los resultados obtenidos al momento de realizar
   * el filtro de órdenes en la opcion search-order-menu.
   *
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {
    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.filterOrdersWithStatus.subscribe(
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
   * Método para cambiar el page size de la tabla órdenes.
   *
   * @param {*} $event
   * @memberof InDevolutionComponent
   */
  changeSizeOrderTable($event: any) {
    log.info($event);
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden.
   *
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
   * Método para obtener la lista de órdenes.
   *
   * @param {any} $event
   * @memberof InDevolutionComponent
   */
  getOrdersList($event: any) {
    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    this.event = $event ;
    const stringSearch = `limit=${$event.lengthOrder}&idSeller=${this.idSeller}&reversionRequestStatusId=${Const.StatusInDevolution}`;
    this.loadingService.viewSpinner();
    this.inDevolutionService.getOrders(stringSearch).subscribe((res: any) => {
      this.loadingService.closeSpinner();
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
    }, () => {
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
  openModalDetailOrder(item: any): void {
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
    this.inDevolutionService.acceptOrDeniedDevolution(information).subscribe(res => {
      if (res) {
        this.getOrdersList(this.currentEventPaginate);
        this.dialogAcceptDevolution();
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.in_devolution.in_devolution_page.sn_error_request'), this.languageService.instant('actions.accpet_min'), 12000);
      }
    }, error => {
      log.error(error);
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.in_devolution.in_devolution_page.sn_error_request'), this.languageService.instant('actions.accpet_min'), 12000);
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


