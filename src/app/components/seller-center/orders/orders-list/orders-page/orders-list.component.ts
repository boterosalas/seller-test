/* 3rd party components */
import { Component, NgZone, OnInit, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSidenav, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';

/* our own custom components */
import { OrderDetailModalComponent } from '../order-detail-modal/order-detail-modal.component';
import { User } from '../../../../shared/models/login.model';
import { environment } from '../../../../../../environments/environment';
import { ShellComponent } from '../../../../../core/shell/shell.component';
import { ComponentsService } from '../../../../../core/services/common/components/components.service';
import { UserService } from '../../../../../core/services/common/user/user.service';
import { SendOrderComponent } from '../send-order/send-order.component';
import { getDutchPaginatorIntl } from '../../../../../core/services/common/components/mat-table.config';
import { Logger } from '../../../../../core/utilities/logger.service';
import { Order, CategoryList, SearchFormEntity, InformationToForm } from '../../../../shared/models/order';
import { Const } from '../../../../shared/util/constants';
import { OrderService } from '../orders.service';

// log component
const log = new Logger('OrdersListComponent');

/**
 * Component principal de ordenes. este componente per mite visualizar la lista de ordenes de acuerdo a
 * los diferentes estados que se pueden manejar en las ordenes. Consta de una serie de componentes:
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
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }],
})

/**
 *  Component que permite cargar las ordenes
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
  // Contiene la información de las ordenes consultadas
  currentOrderList: Array<Order>;
  // Creo el elemento que permite añadir el check a la tabla
  selection = new SelectionModel<Order>(true, []);
  //  Variable que almacena el numero de elementos de la tabla
  numberElements = 0;
  // estado por defecto para listar las ordenes
  stateToListOrders: CategoryList;
  // Variable que contiene la categoría por defecto que se empleara en la consulta inicial
  currentCategory: any = {
    name: 'Todas las ordenes',
    id: ''
  };
  // varialbe que almacena el número de ordenes obtenidas
  orderListLength = false;
  // suscriptions vars
  public subStateOrder: any;
  public subFilterOrder: any;
  public subOrderList: any;
  // Información del usuario
  user: User;
  // Variable que permite indicar si mostrar la opción de check o no
  optionCheckInTable = false;
  // Variable que almacena la ruta actual para saber la categoría que se esta consultando
  currentRootPage: any;
  // Variable que almacena el objeto de paginación actual para listar las ordenes.
  currentEventPaginate: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: `${this.currentCategory.name} ${this.numberElements}`,
    btn_title: 'Consultar ordenes',
    title_for_search: 'Consultar ordenes',
    type_form: 'orders',
    information: new InformationToForm
  };
  // Método que permite crear la fila de detalle de la tabla
  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');

  /**
   * Método para cerrar el modal
   * @param {ShellComponent} shellComponent
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {MatDialog} dialog
   * @param {Location} location
   * @param {ComponentsService} componentService
   * @param {NgZone} zone
   * @param {OrderService} orderService
   * @param {UserService} userService
   * @memberof OrdersListComponent
   */
  constructor(
    public shellComponent: ShellComponent,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public location: Location,
    public componentService: ComponentsService,
    private zone: NgZone,
    private orderService: OrderService,
    public userService: UserService) {

  }

  /**
   * ngOnInit
   * @memberof OrdersListComponent
   */
  ngOnInit() {
    this.shellComponent.validateAccesUser().subscribe(res => {
      // Obtengo la información del usuario
      this.user = this.userService.getUser();

      this.getOrdersListSinceCurrentUrl();

      this.getOrdersListSinceFilterSearchOrder();
    }, err => {
      log.info('Error de autentificación', err);
    });
  }

  /**
   * Funcionalidad para remover las suscripciones creadas.
   * @memberof OrdersListComponent
   */
  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    if (this.subStateOrder !== undefined) {
      this.subStateOrder.unsubscribe();
    }
    if (this.subFilterOrder !== undefined) {
      this.subFilterOrder.unsubscribe();
    }
  }

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de ordenes en la opcion search-order-menu
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {


    this.subFilterOrder = this.shellComponent.eventEmitterOrders.filterOrderList.subscribe(
      (data: any) => {
        log.info(data);
        // log.info("Aplicando resultados obtenidos por el filtro")
        if (data != null) {
          if (data.length === 0) {
            this.orderListLength = true;
          } else {
            this.orderListLength = false;
          }

          this.currentCategory.name = 'Ordenes encontradas';

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
      // log.info(root)
      if (this.currentRootPage !== undefined) {
        /**
         *  logica para obtener la categoria seleccionada
         */
        const category = Const.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
        // log.info(category);

        // si el valor pasado el la url concuerda con la lista de categorías almacenadas,
        // paso a consultar las ordenes con la categoría indicada
        if (category[0] !== undefined) {
          this.currentCategory = category[0];

          // Aplico el filtro par consultar las ordenes en el estado this.currentRootPage, el cual se esta indicando por el usuario
          const data = {
            idStatusOrder: this.currentRootPage
          };
          this.orderService.setCurrentFilterOrders(data);

          // obtengo las ordenes con la función del componente ToolbarOptionsComponent
          this.toolbarOption.getOrdersList(this.currentRootPage);

          this.setTitleToolbar();
        } else {
          //  obtengo las ordenes sin ningun estado en especifico
          // limpio los filtros aplicados para consultar las ordenes
          this.orderService.setCurrentFilterOrders({});
          this.getAllOrderList();
        }
      } else {
        // limpio los filtros aplicados para consultar las ordenes
        this.orderService.setCurrentFilterOrders({});
        // obtengo las ordenes con la función del componente ToolbarOptionsComponent
        this.toolbarOption.getOrdersList();
      }
    });
  }

  /**
   * Funcionalidad para dirigir a la vista principal de ordenes.
   * @memberof OrdersListComponent
   */
  getAllOrderList() {
    this.router.navigate(['/seller-center/ordenes']);
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
   * Método para cambiar el page size de la tabla ordenes
   * @param {any} pageSize
   * @memberof OrdersListComponent
   */
  changeSizeOrderTable($event) {
    log.info($event);
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para setear el nombre de la categoría actual de la pagina
   * @memberof OrdersListComponent
   */
  setCategoryName() {
    // logica para obtener la categoria seleccionada
    const category = Const.CATEGORYLIST.filter(item => item.id === this.currentRootPage);
    if (category.length !== 0) {
      log.info('Categoría actual:', category);

      if (category[0] !== undefined) {
        this.currentCategory = category[0];
      }
    } else {
      log.info('Categoría actual: Todas las ordenes');
      this.currentCategory = {
        name: 'Todas las ordenes',
        id: ''
      };
    }

    this.setTitleToolbar();
  }

  /**
   * Funcionalidad para consultar la lista de ordenes
   * @param {*} $event
   * @param {any} [state]
   * @memberof OrdersListComponent
   */
  getOrdersList($event: any) {
    this.setCategoryName();
    log.info('$Event proporcionado en getOrdersList()', $event);
    if ($event !== undefined) {
      if ($event.lengthOrder > 0) {
        let category = null;
        if ($event.category !== '') {
          category = $event.category;
        }
        this.currentEventPaginate = $event;

        this.orderService.getOrderList(category, this.user, $event.lengthOrder).subscribe((res: any) => {
          this.addCheckOptionInProduct(res, $event.paginator);
        }, err => {
          this.orderListLength = true;
          this.componentService.openSnackBar('Se ha presentado un error al consultar la lista de ordenes', 'Cerrar', 10000);
          log.error('Se ha presentado un error al consultar la lista de ordenes', err);
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
  addCheckOptionInProduct(res, paginator) {
    log.info(res);
    // Logica para crear el contador de ordenes
    log.info('response pasado a addCheckOptionInProduct()', res);
    if (res != null) {
      // si no hay ordenes, muestro el cotenedor de no se han encontrado ordenes
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
  openDialogSendOrder(item): void {
    if (this.getLengthProductForSend(item) === 0) {
      this.componentService.openSnackBar('La orden seleccionada no posee productos para ser enviados.', 'Cerrar', 3000);
    } else {
      this.shellComponent.loadingComponent.viewLoadingProgressBar();
      const dialogRef = this.dialog.open(SendOrderComponent, {
        width: '95%',
        data: {
          user: this.user,
          order: item
        },
        panelClass: 'full-width-dialog'

      });
      dialogRef.afterClosed().subscribe(result => {
        log.info('The dialog was closed', result);

        if (result !== false) {

          log.info('Se han enviado productos, se actualizara el registro de ordenes');
          log.info(result);

          // encuentro el objeto de la orden en el array
          const currentOrder = this.dataSource.data.find(x => x.id === result.id);
          // obtengo el index donde se encuentra el objeto
          const index = this.dataSource.data.indexOf(currentOrder);
          // edito el valor del la variable processedOrder al valor mandado al servidor
          this.dataSource.data[index] = result;

          // let data = JSON.stringify(this.currentOrderList);
          // this.dataSource = new MatTableDataSource(JSON.parse(data));

          log.info(this.dataSource.data[index]);
          this.dataSource._updateChangeSubscription();
        } else {
          log.info('No se han enviado productos de la orden');
        }
        this.shellComponent.loadingComponent.closeLoadingProgressBar();
      });
    }
  }

  /**
   * Funcionalidad para despelgar el modal para visualizar el detalle de una orden.
   * @param {any} item
   * @memberof OrdersListComponent
   */
  openModalDetailOrder(item): void {
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
  recordProcesSedOrder(orderId, currentValue) {

    if (currentValue === true) {
      currentValue = false;
    } else {
      currentValue = true;
    }
    const data = {
      sellerId: this.user[environment.webUrl].sellerId,
      idOrder: orderId,
      value: currentValue,
    };
    log.info(data);


    this.orderService.recordProcesSedOrder(data, this.user).subscribe(res => {
      log.info(res);
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
    });
  }

  /**
   * Método para realizar un update en los datos pasados al componente toolbar-options
   * @memberof OrdersListComponent
   */
  setTitleToolbar() {
    this.informationToForm.title = `${this.currentCategory.name} ${this.numberElements}`
  }
}



