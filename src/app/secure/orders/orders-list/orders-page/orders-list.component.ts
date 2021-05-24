import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginatorIntl, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { AwsUtil, CognitoUtil, LoadingService, Logger, UserLoginService, UserParametersService, ModalService, } from '@app/core';
import { CategoryList, ComponentsService, Const, getDutchPaginatorIntl, InformationToForm, Order, RoutesConst, SearchFormEntity, UserInformation, } from '@app/shared';
import { ShellComponent } from '@core/shell';

import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { OrderService } from '../orders.service';
import { SendOrderComponent } from '../send-order/send-order.component';
import { LoadFileComponent } from '@app/shared/components/load-file/load-file';
import { MenuModel, readFunctionality, downloadFunctionality, sendFunctionality, attachmentFunctionality, allName, idSended, idToSend, sendedName, toSendName, marketFuncionality, visualizeFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { SearchOrderMenuService } from '@app/core/shell/search-order-menu/search-order-menu.service';

// log component
const log = new Logger('OrdersListComponent');

/**
 * Component principal de órdenes. este componente per mite visualizar la lista de órdenes de acuerdo a
 * los diferentes estados que se pueden manejar en las órdenes. Consta de una serie de componentes:
 * ClientInformationComponent: Permite cargar la información del usuario de una orden.
 * OrderDetailModalComponent: Permite visualizar detalladamente la información de una orden, se emplea
 * cuando la resolución es muy baja y solo se puede ver completamente la orden en forma de lista
 * ProductDetailModalComponent: Permite visualizar detalladamente la información de un producto
 * ProductsOrderComponent: Permite cargar la información de los productos de una orden.
 * ToolbarOptionsComponent: Toolbar donde se poseen las categorías que se pueden consultar de una orden.
 */
@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl }],
})

/**
 *  Component que permite cargar las órdenes
 */
export class OrdersListComponent implements OnInit, OnDestroy {

  // Constantes
  public const = Const;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions', { static: false }) toolbarOption;
  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'select',
    'expand',
    'flag',
    'orderNumber',
    'dateOrder',
    'dateMaxDeliveryOrder',
    'statusOrder',
    'channel',
    'detailOrder'];
  //  Creo el elemento que se empleara para la tabla
  dataSource: MatTableDataSource<Order>;
  // Contiene la información de las órdenes consultadas
  currentOrderList: Array<Order>;
  // Creo el elemento que permite añadir el check a la tabla
  selection = new SelectionModel<Order>(true, []);
  //  Variable que almacena el numero de elementos de la tabla
  numberElements = 0;
  // estado por defecto para listar las órdenes
  stateToListOrders: CategoryList;
  // Variable que contiene la categoría por defecto que se empleara en la consulta inicial
  currentCategory: any = {
    name: 'secure.orders.order_list.order_page.all_orders',
    id: ''
  };





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
  public idStatus = '';
  public identificationCard = '';
  public processedOrder = '';
  public bill = '';


  public length = 0;
  public pageSize = 50;
  public querySearch = '';



  // ------------------------------------------------------------
  dataListOrder = [];






  // Variables con los permisos que este componente posee.
  permissionComponent: MenuModel;
  read = readFunctionality;
  download = downloadFunctionality;
  attachment = attachmentFunctionality;
  send = sendFunctionality;
  market = marketFuncionality;
  visualizeFunctionality = visualizeFunctionality;
  readPermission: boolean;
  downloadPermission: boolean;
  sendPermission: boolean;
  attachmentPermission: boolean;
  marketPermission: boolean;
  visualizePermission: boolean;
  showMenssage = false;
  isClear = false;
  pageIndexChange = 0;
  isFullSearch = false;


  typeProfile: number;
  // Fin de variables de permisos.

  // varialbe que almacena el número de órdenes obtenidas
  orderListLength = false;
  // suscriptions vars
  public subStateOrder: any;
  public subFilterOrder: any;
  public subOrderList: any;
  // Información del usuario
  public user: UserInformation;
  // Variable que permite indicar si mostrar la opción de check o no
  optionCheckInTable = false;
  // Variable que almacena la ruta actual para saber la categoría que se esta consultando
  currentRootPage: any;
  // Variable que almacena el objeto de paginación actual para listar las órdenes.
  currentEventPaginate: any;
  // Variable para almacenar los filtros seleccionados
  allFilter: any;


  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'secure.orders.orders',
    subtitle: 'secure.orders.order_list.order_page.all_orders',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: this.numberElements.toString()
  };

  // Fecha inicial desde el dashboar. info obtenida desde la url
  initialDate: any;
  // Fecha final desde el dashboar. info obtenida desde la url
  finalDate: any;
  // Tipo de orden (1 = por enviar, 2 = en trasnporte, 3 = entregado) desde el dashboar. info obtenida desde la url
  typeCardToDashboard: any;

  public cognitoId: string;
  public numberLength: number;
  public lastState: number;
  private searchSubscription: any;
  public userCurrent: any;
  public isInternational = false;
  public arrayPermission: any;
  currentLanguage: string;
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');



  constructor(
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public location: Location,
    public componentService: ComponentsService,
    private orderService: OrderService,
    public awsUtil: AwsUtil,
    public userService: UserLoginService,
    public cognito: CognitoUtil,
    public userParams: UserParametersService,
    public authService: AuthService,
    private languageService: TranslateService,
    public eventsSeller: EventEmitterSeller,
    private profileService: MyProfileService,
    public modalService: ModalService,
    public searchOrderMenuService: SearchOrderMenuService,

  ) {
    this.getAllDataUser();
    this.getListbyParams();
  }


  /**
   * ngOnInit
   * @memberof OrdersListComponent
   */
  ngOnInit() {
    this.getMenuSelected();
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      if (seller) {
        if (seller.IdSeller) {
          this.idSeller = seller.IdSeller;
        }
        if (seller.Country) {
          if (seller.Country === 'Colombia' || seller.Country === 'COLOMBIA') {
            this.isInternational = false;
          } else {
            this.isInternational = true;
          }
        } else {
          this.isInternational = false;
        }
      }
      const paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller,
        'state': this.lastState,
        'callOne': true
      };
      this.getOrdersList(paramsArray);

    });
    this.changeLanguage();
    // this.getListbyParams();

  }

  /**
   * Obtener parametros de la ruta
   * @memberof OrdersListComponent
   */
  getListbyParams() {
    this.route.params.subscribe(params => {
      this.initialDate = params.dateInitial;
      this.finalDate = params.dateFinal;
      this.typeCardToDashboard = params.type;
    });
  }

  /**
   * LLama servicio datos por url, enviadas, por enviar
   * @memberof OrdersListComponent
   */
  callServiceParams() {
    let stateCurrent = null;
    if (this.typeCardToDashboard === '3') {
      const dataParamsRouteFilter = '&dateOrderInitial=' + this.initialDate + '&dateOrderFinal=' + this.finalDate + '&idStatusOrder=' + 60;
      if (this.initialDate || this.finalDate) {
        this.setCategoryName();
        this.loadingService.viewSpinner();
        this.searchOrderMenuService.getOrdersFilter(50, dataParamsRouteFilter).subscribe((res: any) => {
          if (res) {
            if (res.pendingResponse) {
              this.getOrdersList(this.params);
            } else {
              stateCurrent = this.params ? this.params.state : null;
              this.lastState = stateCurrent;
              this.setTable(res);
              if (this.params && this.params.callOne) {
                this.length = res.data.count;
                this.isClear = true;
              }
              const paginator = { 'pageIndex': 0 };
              this.addCheckOptionInProduct(res.data.viewModel, paginator);
            }
            this.loadingService.closeSpinner();

          }
        });
      }
    } else {
      const dataParamsRouteFilter = '&dateOrderInitial=' + this.initialDate + '&dateOrderFinal=' + this.finalDate + '&idStatusOrder=' + this.currentRootPage;
      if (this.initialDate || this.finalDate) {
        this.setCategoryName();
        this.loadingService.viewSpinner();
        this.searchOrderMenuService.getOrdersFilter(50, dataParamsRouteFilter).subscribe((res: any) => {
          if (res) {
            if (res.pendingResponse) {
              this.getOrdersList(this.params);
            } else {
              stateCurrent = this.params ? this.params.state : null;
              this.lastState = stateCurrent;
              this.setTable(res);
              if (this.params && this.params.callOne) {
                this.length = res.data.count;
                this.isClear = true;
              }
              const paginator = { 'pageIndex': 0 };
              this.addCheckOptionInProduct(res.data.viewModel, paginator);
            }
            this.loadingService.closeSpinner();

          }
        });
      }
    }
  }

  async getAllDataUser() {
    if (this.profileService.getUser() && await this.profileService.getUser().toPromise()) {
      const sellerData = await this.profileService.getUser().toPromise().then(res => {
        const body: any = res.body;
        const response = JSON.parse(body.body);
        const userData = response.Data;
        return userData;
      });
      if (sellerData.Country !== 'COLOMBIA') {
        this.isInternational = true;
      } else {
        this.isInternational = false;
      }
    }
  }
  /**
   * funcion para escuchar el evento al cambiar de idioma
   *
   * @memberof OrdersListComponent
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
      const paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller,
        'state': this.lastState,
        'callOne': true
      };
      this.getOrdersList(paramsArray);
    });
  }


  /**
   * Funcion para verificar el menu y los permisos que este posee.
   * Verifica si la ruta posee ID (esto indica que debe tener las ordenes de ese tipo)
   * y si no posee id trae todos los estados.
   * @memberof OrdersListComponent
   */
  public getMenuSelected(): void {
    this.route.params.subscribe(params => {
      this.currentRootPage = params['category'];
      const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
      // Mediante la categoria obtiene el menu al cual desea apuntar
      if (!category[0]) {
        this.getDataUser(allName);
      } else {
        const selected = category[0].id;
        if (selected.toString() === idSended) {
          this.getDataUser(sendedName);
        } else if (selected.toString() === idToSend) {
          this.getDataUser(toSendName);
        }
      }
      // Logica para cargar el componente
      // this.getOrdersListSinceCurrentUrl();
      this.getOrdersListSinceFilterSearchOrder();
      this.clearData();
      if (this.initialDate || this.finalDate || this.typeCardToDashboard) {
        this.callServiceParams();
      } else {
        this.getOrdersListSinceCurrentUrl();
      }
    });
  }

  async getDataUser(nameMenu: string) {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(nameMenu, 1);
      this.setPermission(1);
    }
  }
  /**
   * Funcion para obtener los permisos del componente
   * @param {number} typeProfile
   * @memberof OrdersListComponent
   */
  setPermission(typeProfile: number) {
    // Permisos del componente.
    this.typeProfile = typeProfile;
    this.readPermission = this.getFunctionality(this.read);
    this.downloadPermission = this.getFunctionality(this.download);
    this.sendPermission = this.getFunctionality(this.send);
    this.attachmentPermission = this.getFunctionality(this.attachment);
    this.marketPermission = this.getFunctionality(this.market);
    this.visualizePermission = this.getFunctionality(this.visualizeFunctionality);
    this.arrayPermission = {
      read: this.readPermission,
      download: this.downloadPermission,
      send: this.sendPermission,
      attachment: this.attachmentPermission,
      market: this.marketPermission,
      visualize: this.visualizePermission
    };
  }

  /**
   * Funcion que verifica si la funcion del modulo posee permisos
   *
   * @param {string} functionality
   * @returns {boolean}
   * @memberof ToolbarComponent
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }

  /**
   * Abre el dialogo para carar un archivo, dependiendo del tipo
   *
   * @memberof OrdersListComponent
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


  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de órdenes en la opcion search-order-menu
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {
    this.subFilterOrder = this.shellComponent.eventEmitterOrders.filterOrderList.subscribe(
      (data: any) => {
        if (data && data.data.count > 0) {
          if (data != null) {
            if (data.data && data.data.viewModel && data.data.viewModel.length === 0) {
              this.orderListLength = true;
            } else {
              this.orderListLength = false;
            }
            if (this.dataListOrder && this.dataListOrder.length > 0) {
              this.numberElements = this.dataListOrder.length;
            } else {
              this.numberElements = 0;
            }
            this.length = data.data.count;
            this.isClear = true;
            this.dataSource = new MatTableDataSource(data.data.viewModel);
            this.dataListOrder = data.data.viewModel;
            const paginator = this.toolbarOption.getPaginator();
            paginator.pageIndex = 0;
            this.dataSource.paginator = paginator;
            this.dataSource.sort = this.sort;
            this.setTitleToolbar();
            this.loadingService.closeSpinner();
          }
        } else {
          this.orderListLength = true;
          this.length = 0;
          this.isClear = true;
          this.dataSource = new MatTableDataSource();
          this.dataListOrder = [];
          const paginator = this.toolbarOption.getPaginator();
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.setTitleToolbar();
          this.loadingService.closeSpinner();
        }

        if (data && data.filter) {
          this.dateOrderInitial = data.filter.dateOrderInitial;
          this.dateOrderFinal = data.filter.dateOrderFinal;
          this.idChannel = data.filter.idChannel;
          this.idStatus = data.filter.idStatus;
          this.orderNumber = data.filter.orderNumber;
          this.identificationCard = data.filter.identificationCard;
          this.processedOrder = data.filter.processedOrder;
          this.bill = data.filter.bill;
        }
        this.allFilter = data.filter;
      });
  }
  /**
   * limpia la tabla
   *
   * @memberof OrdersListComponent
   */
  clearData() {
    this.subFilterOrder = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
      (data: any) => {
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'idSeller': this.idSeller,
          'state': this.lastState,
          'callOne': true,
          'clear': true
        };
        this.isClear = true;
        this.getOrdersList(paramsArray);
      });
  }

  /**
   * Evento que permite obtener los parametros pasados por la url
   * @memberof OrdersListComponent
   */
  getOrdersListSinceCurrentUrl() {
    this.subStateOrder = this.route.params.subscribe(params => {
      this.currentRootPage = params['category'];
      if (this.currentRootPage !== undefined) {
        const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
        if (category[0] !== undefined) {
          this.currentCategory = category[0];
          const data = {
            idStatusOrder: this.currentRootPage
          };
          const paramsArray = {
            'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
            'idSeller': this.idSeller,
            'state': this.currentRootPage,
            'callOne': true
          };
          this.orderService.setCurrentFilterOrders(data);
          this.getOrdersList(paramsArray);
          this.setTitleToolbar();
        } else {
          this.orderService.setCurrentFilterOrders({});
          this.getAllOrderList();
        }
      } else {
        this.orderService.setCurrentFilterOrders({});
        this.getOrdersList();
      }
    });
    this.ngOnDestroy();
  }

  /**
   * Funcionalidad para dirigir a la vista principal de órdenes.
   * @memberof OrdersListComponent
   */
  getAllOrderList() {
    const paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
      'idSeller': this.idSeller,
      'state': this.lastState,
      'callOne': true,
      'clear': true
    };
    this.isClear = true;
    this.getOrdersList(paramsArray);
  }

  /**
   * Funcionalidad para cancelar los propagation .
   * @param {Event} event
   * @memberof OrdersListComponent
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   * @memberof OrdersListComponent
   */
  changeSizeOrderTable($event: any) {
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para setear el nombre de la categoría actual de la pagina
   * @memberof OrdersListComponent
   */
  setCategoryName() {
    // logica para obtener la categoria seleccionada
    const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
    if (category.length !== 0) {

      if (category[0] !== undefined) {
        this.currentCategory = category[0];
      }
    } else {
      this.currentCategory = {
        // name: 'Todas las órdenes',
        name: 'secure.orders.order_list.order_page.all_orders',
        id: ''
      };
    }

    this.setTitleToolbar();
  }
  /**
   * Funcionalidad para consultar la lista de órdenes
   * @param {*} $event
   * @param {any} [state]
   * @memberof OrdersListComponent
   */
  getOrdersList(params?: any) {
    this.loadingService.viewSpinner();
    this.isClear = false;
    this.params = this.setParameters(params);
    let stateCurrent = null;
    this.setCategoryName();
    this.orderService.getOrderList(this.params).subscribe((res: any) => {
      if (res) {
        if (res.pendingResponse) {
          this.getOrdersList(params);
        } else {
          stateCurrent = params ? params.state : null;
          this.lastState = stateCurrent;
          this.setTable(res);
          if (params && params.callOne) {
            this.length = res.data.count;
            this.isClear = true;
          }
          const paginator = { 'pageIndex': 0 };
          this.addCheckOptionInProduct(res.data.viewModel, paginator);
        }
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
      this.idChannel = '';
      this.orderNumber = '';
      this.idStatus = '';
      this.identificationCard = '';
      this.processedOrder = '';
      this.bill = '';
    }
    const paramsArray = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken) + this.querySearch,
      'idSeller': this.idSeller,
      'state': params ? params.state : null,
      'dateOrderFinal': this.dateOrderFinal,
      'dateOrderInitial': this.dateOrderInitial,
      'idChannel': this.idChannel,
      'idStatus': this.idStatus,
      'orderNumber': this.orderNumber,
      'identificationCard': this.identificationCard,
      'processedOrder': this.processedOrder,
      'bill': this.bill,
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
        this.length = res.data.count;
        this.arrayPosition = [];
        this.arrayPosition.push('{}');
      }
      this.dataSource = new MatTableDataSource(res.data.viewModel);
      res.data.viewModel.forEach(element => {
        element.statusLoad = false;
      });
      this.dataListOrder = res.data.viewModel;
      this.savePaginationToken(res.data.paginationToken);
      this.loadingService.closeSpinner();
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
    this.length = 0;
  }
  /**
   * funcion que escucha el cambio de paginacion y el rango de busqueda
   *
   * @param {*} event
   * @memberof OrdersListComponent
   */
  paginations(event: any) {
    const index = event.param.pageIndex;
    if (event.param.pageSize !== this.pageSize) {
      this.pageSize = event.param.pageSize;
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
      'dateOrderInitial': this.dateOrderInitial,
      'bill': this.bill
    };
    this.getOrdersList(params);
  }

  /**
   * Funcionalidad para agregar las opciones de check a la tabla.
   * @param {any} res
   * @param {any} paginator
   * @memberof OrdersListComponent
   */
  addCheckOptionInProduct(res: any, paginator: any) {
    if (res != null) {
      if (res.length === 0) {
        this.orderListLength = true;
      } else {
        this.orderListLength = false;
      }
    } else {
      this.orderListLength = true;
      res = [];
    }
    for (let index = 0; index < res.length; index++) {
      res[index].sendAllProduct = false;
      for (let j = 0; j < res[index].products.length; j++) {
        res[index].products[j].checkProductToSend = false;
      }
    }

    this.setTitleToolbar();
  }

  /**
   * Whether the number of selected elements matches the total number of rows
   * @returns
   * @memberof OrdersListComponent
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   * @memberof OrdersListComponent
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
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
      log.info(message);
    } else {
      const message = this.languageService.instant('secure.orders.order_list.order_page.info_total_products');
      log.info(message, numberElements);
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
        if (result !== false) {
          const currentOrder = this.dataSource.data.find(x => x.id === result.id);
          const index = this.dataSource.data.indexOf(currentOrder);
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        } else {
          const message = this.languageService.instant('secure.orders.order_list.order_page.info_no_send_products');
          log.info(message);
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
      log.info('The modal OrderDetailModalComponent was closed');
    });
  }

  /**
   * Método para realizar un update en los datos pasados al componente toolbar-options
   * @memberof OrdersListComponent
   */
  setTitleToolbar() {
    this.informationToForm.subtitle = `${this.currentCategory.name}`;
  }

  /**
   * Se crea funcion para transformar fecha dependiendo de la zona horaria. (getTimezoneOffset)
   *
   * @param {*} date
   * @returns {*}
   * @memberof OrdersListComponent
   */
  public getDateWithOutGMT(date: any): any {
    const timezone = new Date().getTimezoneOffset();
    const time = new Date(date).getTime(); // new Date('2019-02-03T00:42:06.177+00:00').getTime();
    return new Date(time + (timezone * 60 * 1000));
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
      log.error(error);
    });
  }

  isOpened(data: any) {
  }

  consultDetails($event: any, item: any) {
    item.statusLoad = true;
  }

  /**
   * funcion para destruir las subcripciones abiertas
   *
   * @memberof OrdersListComponent
   */
  ngOnDestroy() {
    if (this.subStateOrder !== undefined) {
      this.subStateOrder.unsubscribe();
    }
    if (this.subFilterOrder !== undefined) {
      this.subFilterOrder.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
