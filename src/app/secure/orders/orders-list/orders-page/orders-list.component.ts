import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginatorIntl, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

import { AwsUtil, CognitoUtil, LoadingService, Logger, UserLoginService, UserParametersService, } from '@app/core';
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
  @ViewChild(MatSort) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
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
    name: 'Todas las órdenes',
    id: ''
  };

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

  profile: number;
  idSeller: number;
  event: any;
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
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Órdenes',
    subtitle: `${this.currentCategory.name} ${this.numberElements}`,
    btn_title: 'Consultar órdenes',
    title_for_search: 'Consultar órdenes',
    type_form: 'orders',
    information: new InformationToForm
  };

  public cognitoId: String;
  public numberLength: number;
  public lastCategory: number;
  private searchSubscription: any;
  // Método que permite crear la fila de detalle de la tabla
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
    public eventsSeller: EventEmitterSeller,
  ) { }

  /**
   * ngOnInit
   * @memberof OrdersListComponent
   */
  ngOnInit() {
    this.getMenuSelected();
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      if (this.event) {
        this.getOrdersList(this.event);
      }
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
      this.getOrdersListSinceCurrentUrl();
      this.getOrdersListSinceFilterSearchOrder();
    });
  }

  async getDataUser(nameMenu: string) {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent =  this.authService.getMenuProfiel(nameMenu, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent =  this.authService.getMenuProfiel(nameMenu, 1);
      this.setPermission(1);
    }
  }

   setPermission(typeProfile: number) {
    // Permisos del componente.
    this.typeProfile = typeProfile;
    this.readPermission = this.getFunctionality(this.read);
    this.downloadPermission = this.getFunctionality(this.download);
    this.sendPermission = this.getFunctionality(this.send);
    this.attachmentPermission = this.getFunctionality(this.attachment);
    this.marketPermission = this.getFunctionality(this.market);
    this.visualizePermission = this.getFunctionality(this.visualizeFunctionality);
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
        if (data != null) {
          if (data.length === 0) {
            this.orderListLength = true;
          } else {
            this.orderListLength = false;
          }

          /* this.currentCategory.name = 'órdenes encontradas'; */

          this.dataSource = new MatTableDataSource(data);

          const paginator = this.toolbarOption.getPaginator();
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.numberElements = this.dataSource.data.length;

          this.setTitleToolbar();
        }
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
        /**
         *  logica para obtener la categoria seleccionada
         */
        const category = RoutesConst.CATEGORYLIST.filter(item => item.id === this.currentRootPage);

        // si el valor pasado el la url concuerda con la lista de categorías almacenadas,
        // paso a consultar las órdenes con la categoría indicada
        if (category[0] !== undefined) {
          this.currentCategory = category[0];

          // Aplico el filtro par consultar las órdenes en el estado this.currentRootPage, el cual se esta indicando por el usuario
          const data = {
            idStatusOrder: this.currentRootPage
          };
          this.orderService.setCurrentFilterOrders(data);
          // obtengo las órdenes con la función del componente ToolbarOptionsComponent
          this.toolbarOption.getOrdersList(this.currentRootPage);
          this.setTitleToolbar();
        } else {
          //  obtengo las órdenes sin ningun estado en especifico
          // limpio los filtros aplicados para consultar las órdenes
          this.orderService.setCurrentFilterOrders({});
          this.getAllOrderList();
        }
      } else {
        // limpio los filtros aplicados para consultar las órdenes
        this.orderService.setCurrentFilterOrders({});
        // obtengo las órdenes con la función del componente ToolbarOptionsComponent
        this.toolbarOption.getOrdersList();
      }
    });
    this.ngOnDestroy();
  }

  /**
   * Funcionalidad para dirigir a la vista principal de órdenes.
   * @memberof OrdersListComponent
   */
  getAllOrderList() {
    this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
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
   * @param {any} pageSize
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
        name: 'Todas las órdenes',
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
  getOrdersList($event: any) {
    this.event = $event ;
    this.setCategoryName();
    this.loadingService.viewSpinner();
    if ($event !== undefined) {
      if ($event.lengthOrder > 0) {
        let category = null;
        if ($event.lengthOrder === this.numberLength || !this.numberLength || $event.category) {
          this.numberLength = $event.lengthOrder;
          if ($event.category !== '') {
            category = $event.category;
            this.lastCategory = category;
          }
        } else {
          category = this.lastCategory;
        }
        this.currentEventPaginate = $event;
        this.orderService.getOrderList(category, $event.lengthOrder, this.idSeller).subscribe((res: any) => {
          this.loadingService.closeSpinner();
          this.addCheckOptionInProduct(res, $event.paginator);
        }, err => {
          this.orderListLength = true;
          this.componentService.openSnackBar('Se ha presentado un error al consultar la lista de órdenes', 'Cerrar', 10000);
          log.error('Se ha presentado un error al consultar la lista de órdenes', err);
        });
      } else {
        this.componentService.openSnackBar('Indique un limite de registros', 'Cerrar', 1000);
      }
    } else {
      this.componentService.openSnackBar('Indique un limite de registros', 'Cerrar', 1000);
    }
  }

  /**
   * Funcionalidad para agregar las opciones de check a la tabla.
   * @param {any} res
   * @param {any} paginator
   * @memberof OrdersListComponent
   */
  addCheckOptionInProduct(res: any, paginator: any) {
    // Logica para crear el contador de órdenes
    if (res != null) {
      // si no hay órdenes, muestro el cotenedor de no se han encontrado órdenes
      if (res.length === 0) {
        this.orderListLength = true;
      } else {
        this.orderListLength = false;
      }
    } else {
      this.orderListLength = true;
      res = [];
    }
    // Logica para agregar la opción check en un producto
    for (let index = 0; index < res.length; index++) {

      // Agrego la opción que habilitara el botón de enviar todo al seleccionar todos los checks
      res[index].sendAllProduct = false;
      for (let j = 0; j < res[index].products.length; j++) {
        // agrego la opción de check a cada uno de los productos.
        res[index].products[j].checkProductToSend = false;
      }
    }

    // Creo el elemento que permite pintar la tabla
    this.currentOrderList = res;
    this.dataSource = new MatTableDataSource(res);
    paginator.pageIndex = 0;
    this.dataSource.paginator = paginator;
    this.dataSource.sort = this.sort;
    this.numberElements = this.dataSource.data.length;

    this.setTitleToolbar();
  }

  /**
   * Funcionalidad para poder filtrar los datos de la tabla
   * @param {string} filterValue
   * @memberof OrdersListComponent
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    //  Remove whitespace
    filterValue = filterValue.toLowerCase();
    //  Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
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
      log.info('La orden ya no posee mas productos para ser enviados');
    } else {
      log.info('Total del productos a ser enviados en la orden', numberElements);
    }
    return numberElements;
  }

  /**
   * Funcionalidad para desplegar el modal que permite hacer el envío de todos los productos de una orden.
   * @param {any} item
   * @memberof OrdersListComponent
   */
  openDialogSendOrder(item: any): void {
    if (this.getLengthProductForSend(item) === 0) {
      this.componentService.openSnackBar('La orden seleccionada no posee productos para ser enviados.', 'Cerrar', 3000);
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

          // encuentro el objeto de la orden en el array
          const currentOrder = this.dataSource.data.find(x => x.id === result.id);
          // obtengo el index donde se encuentra el objeto
          const index = this.dataSource.data.indexOf(currentOrder);
          // edito el valor del la variable processedOrder al valor mandado al servidor
          this.dataSource.data[index] = result;

          // let data = JSON.stringify(this.currentOrderList);
          // this.dataSource = new MatTableDataSource(JSON.parse(data));
          this.dataSource._updateChangeSubscription();
        } else {
          log.info('No se han enviado productos de la orden');
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
   * Método para marcar una orden y actualizar el registro mediante un servicio web
   * @param {any} orderId
   * @param {any} currentValue
   * @memberof OrdersListComponent
   */
  recordProcesSedOrder(orderId: any, currentValue: any) {
    if (currentValue === true) {
      currentValue = false;
    } else {
      currentValue = true;
    }
    const data = {
      idOrder: orderId,
      value: currentValue,
    };
    this.orderService.recordProcesSedOrder(data)
      .subscribe((result: any) => {
        if (result.status === 200) {
          // encuentro el objeto de la orden en el array
          const currentOrder = this.dataSource.data.find(x => x.id === orderId);
          // obtengo el index donde se encuentra el objeto
          const index = this.dataSource.data.indexOf(currentOrder);
          // edito el valor del la variable processedOrder al valor mandado al servidor
          this.dataSource.data[index].processedOrder = currentValue;

          if (currentValue) {
            this.componentService.openSnackBar('Se ha marcado la orden correctamente', 'Cerrar', 10000);

          } else {
            this.componentService.openSnackBar('Se ha removido la marca de la orden correctamente', 'Cerrar', 10000);
          }
        }
      });
  }

  /**
   * Método para realizar un update en los datos pasados al componente toolbar-options
   * @memberof OrdersListComponent
   */
  setTitleToolbar() {
    this.informationToForm.subtitle = `${this.currentCategory.name} ${this.numberElements}`;
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
    return new Date( time + (timezone * 60 * 1000) );
  }


  ngOnDestroy() {
    if (this.subStateOrder !== undefined) {
      this.subStateOrder.unsubscribe();
    }
    if (this.subFilterOrder !== undefined) {
      this.subFilterOrder.unsubscribe();
    }
  }
}
