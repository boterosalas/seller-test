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
import { Router, ActivatedRoute } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { isEmpty } from 'lodash';

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
    'transferRequestDate',
    'commission',
    'iva',
    'valueToPay',
    'detailOrder'
  ];
  // Permiso de descarga
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
    title: 'module.Facturación',
    subtitle: 'menu.Detalle de Pagos',
    title_for_search: 'secure.billing.check_billing',
    btn_title: 'secure.billing.check_billing',
    type_form: 'billing',
    information: new InformationToForm,
    count: ''
  };

  public iva = (100 / 19);
  isInternational = false;
  stringOrderList = '';
  isFullSearch = true;
  typeProfile: number;
  searchSubscription: any;
  public pageSize = 50;
  idSeller: any;
  nameSeller: string;
  onlyOne: boolean;

  // seller que se obtiene del buscador
  sellerIdSearch: any;

  public arrayPosition = [];
  public paginationToken = '{}';
  length: number;
  public callOne = true;
  public myform: FormGroup;

  invalidOrder: Boolean = false;
  keywords: Array<any> = [];
  validateKey = true;
  removable = true;
  public locale = 'es-CO';

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
    public eventsSeller: EventEmitterSeller,
    public billinService: BillingService,
    public component: ComponentsService,
    public shellComponent: ShellComponent,
    private userParams: UserParametersService,
    private profileService: MyProfileService,
    private route: ActivatedRoute,
    public router?: Router,
    private fb?: FormBuilder,
    public userService?: UserLoginService,
    private loadingService?: LoadingService,
  ) {
    // this.getDataUser();
  }

  /**
   * @memberof BillingComponent
   */
  ngOnInit() {
    this.eventEmitSearch();

    this.route.params.subscribe(params => {
      if (params['listBilling'] != null) {
        this.filterBilling(params['listBilling']);
      }
    });
    this.userService.isAuthenticated(this);
    // this.getAllDataUser();
    this.getOrdersList();
    // this.getOrdersListSinceFilterSearchOrder();

    // remove storage from export billing pay when refresh page

    if (performance.navigation.type === 1) {
      localStorage.removeItem('currentFilterBillingPay');
    }
    this.createForm();
  }

  createForm() {
    // Estructura para los datos del formulario de consulta.
    this.myform = this.fb.group({
      'paymentDateInitial': [null, Validators.compose([])],
      'paymentDateFinal': [null, Validators.compose([])],
      'billingNumber': [null, Validators.compose([Validators.minLength(1)])],
      'orderNumber': [null, Validators.compose([Validators.minLength(1)])],
    });
  }

  clearForm() {
    this.myform.reset();
  }

  filterOrder() {
    // Formatear la fechas.
    const datePipe = new DatePipe(this.locale);

    // Formatear la fechas.
    const paymentDateInitial = datePipe.transform(this.myform.controls.paymentDateInitial.value, 'yyyy/MM/dd');
    const paymentDateFinal = datePipe.transform(this.myform.controls.paymentDateFinal.value, 'yyyy/MM/dd');

    // String que indicara los parametros de la consulta.
    let stringSearch = '';
    const objectSearch: any = {};

    if (!isEmpty(paymentDateInitial) && !isEmpty(paymentDateFinal)) {
      // paymentDateInitial
      stringSearch += `&paymentDateInitial=${paymentDateInitial}`;
      objectSearch.paymentDateInitial = paymentDateInitial;
      // paymentDateFinal
      stringSearch += `&paymentDateFinal=${paymentDateFinal}`;
      objectSearch.paymentDateFinal = paymentDateFinal;
    }

    if (!isEmpty(this.myform.controls.billingNumber.value)) {
      stringSearch += `&billingNumber=${this.myform.controls.billingNumber.value}`;
      objectSearch.billingNumber = this.myform.controls.billingNumber.value;
    }
    if (!isEmpty(this.keywords)) {
      const strintArray = this.keywords.toString();
      stringSearch += `&orderNumber=${strintArray}`;
      objectSearch.orderNumber = strintArray;
    }

    console.log('stringSearch: ', stringSearch);

    this.getOrdersList(null, stringSearch);
  }


  /**
   * Función para ir guardando las categorías como chips.
   * @memberof BillingComponent
   */
  public saveKeyword(): void {
    let word = this.myform.controls.orderNumber.value;
    if (word) {
      word = word.trim();
      if (word.search(',') === -1) {
        if (this.invalidOrder === false) {
          this.keywords.push(word);
        }
      } else {
        const counter = word.split(',');
        counter.forEach(element => {
          if (element) {
            this.keywords.push(element);
          }
        });
      }
      this.myform.controls.orderNumber.clearValidators();
      this.myform.controls.orderNumber.reset();
      this.validateKey = this.keywords.length > 0 ? false : true;
    }
    console.log(0, this.keywords);
  }

  /**
   * Metodo para eliminar chips dentro del filtro
   * @param {number} indexOfValue
   * @memberof BillingComponent
   */
  public deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.validateKey = this.keywords.length > 0 ? false : true;
    if (this.keywords.length < 1) {
      this.myform.setErrors({ required: true });
    }
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    // if (this.user) {
    //   this.toolbarOption.getOrdersList();
    //   this.getOrdersListSinceFilterSearchOrder();
    //   this.loadingService.closeSpinner();
    // }
    if (this.user.sellerProfile !== 'seller') {
      this.setPermission(1);
      // this.router.navigate([`/${RoutesConst.securehome}`]);
    } else {
      this.idSeller = this.user.sellerId;
      this.getOrdersList();
      this.getOrdersListSinceFilterSearchOrder();
      this.loadingService.closeSpinner();
      this.setPermission(0);
      // this.getOrdersList(Event);
      // this.getLastSales();
    }

  }

  /**
   * @method getUserData
   * @description Método que carga los datos del vendedor para obtener la sellerId.
   * @memberof DashboardComponent
   */
  // public async getUserData() {
  //   this.user = !!this.user ? this.user : await this.userParams.getUserData();

  //   if (this.user.sellerProfile !== 'seller') {
  //     this.setPermission(1);
  //     // this.router.navigate([`/${RoutesConst.securehome}`]);
  //   } else {
  //     this.setPermission(0);
  //     // this.getOrdersList(Event);
  //     // this.getLastSales();
  //   }
  // }

  setPermission(typeProfile: number) {
    // Permisos del componente.
    this.typeProfile = typeProfile;
    // this.readPermission = this.getFunctionality(this.read);
    // this.downloadPermission = this.getFunctionality(this.download);
    // this.sendPermission = this.getFunctionality(this.send);
    // this.attachmentPermission = this.getFunctionality(this.attachment);
    // this.marketPermission = this.getFunctionality(this.market);
    // this.visualizePermission = this.getFunctionality(this.visualizeFunctionality);
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
    console.log('entra a este q no se q es');
    this.loadingService.viewSpinner();
    this.subFilterOrderBilling = this.shellComponent.eventEmitterOrders.filterBillingList.subscribe(
      (data: any) => {
        if (data != null) {
          if (data.length === 0) {
            console.log('here 1');
            this.orderListLength = true;
          } else {
            this.orderListLength = false;
          }
          this.dataSource = new MatTableDataSource(data);

          // se reccorre la respuesta de la lista y se pone la comision en negativo
          this.dataSource.data.forEach(element => {
            element.commission *= -1;
          });

          const paginator = this.toolbarOption.getPaginator();
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.numberElements = this.dataSource.data.length;
          this.loadingService.closeSpinner();
        }
      });
  }

  /**
   * Funcionalidad para consultar la lista de devoluciones pendientes.
   *
   * @param {any} $event
   * @memberof BillingComponent
   */
  getOrdersList($event?: any, paramsFIlter?: any) {
    this.loadingService.viewSpinner();
    let sellerid;
    let limit;
    if ($event) {
      console.log('entra aqui: ', $event);
      sellerid = $event.idSeller;
      limit = $event.limit;
    } else {
      console.log('else: ', this.idSeller);
      sellerid = this.idSeller;
      limit = this.pageSize + '&paginationToken=' + encodeURI('{}');
    }
    let stringSearch = `?idSeller=${sellerid}&limit=${limit}`;
    if (paramsFIlter) {
      stringSearch = `?idSeller=${sellerid}&limit=${limit}${paramsFIlter}`;

    }
    this.billinService.getBilling(this.user, stringSearch).subscribe((res) => {
      if (res != null) {
        if (this.callOne) {
          this.length = res['count'];
          if (res.length === 0) {
            this.orderListLength = true;
          } else {
            this.orderListLength = false;
          }
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = res['paginationToken'];
        // Creo el elemento que permite pintar la tabla
        this.dataSource = new MatTableDataSource(res['viewModel']);
        console.log('this.dataSource: ', this.dataSource);
        // se reccorre la respuesta de la lista y se pone la comision en negativo
        if (this.dataSource.data) {
          this.dataSource.data.forEach(element => {
            element.commission *= -1;
          });
        }
        // this.dataSource.paginator = $event.paginator;
        this.dataSource.sort = this.sort;
        this.numberElements = this.dataSource.data.length;
        this.loadingService.closeSpinner();

      } else {
        this.loadingService.closeSpinner();
        this.dataSource = new MatTableDataSource(null);
        this.numberElements = 0;
        this.loadingService.closeSpinner();

      }
    }, err => {
      this.loadingService.closeSpinner();
      this.orderListLength = true;
    });
  }

  paginations(event: any) {
    const index = event.param.pageIndex;
    if (event.param.pageSize !== this.pageSize) {
      this.pageSize = event.param.pageSize;
      if (this.arrayPosition && this.arrayPosition.length > 0) {
        this.arrayPosition = [];
      }
    } else {
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
    }
    const params = {
      'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
      'idSeller': this.idSeller,
    };
    this.getOrdersList(params);
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
      this.getDataUser();
    }
  }

  async getAllDataUser() {
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.loadingService.closeSpinner();
      return userData;
    });
    if (sellerData.Country === 'COLOMBIA') {
      this.isInternational = false;
    } else {
      this.isInternational = true;
    }
  }

  filterBilling(orderList: any) {
    if (orderList.length > 0) {
      this.stringOrderList = orderList;
    }
  }

  eventEmitSearch() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      console.log(1, seller);
      this.idSeller = seller.IdSeller;
      this.nameSeller = seller.Name;
      this.onlyOne = true;
      localStorage.setItem('sellerIdSearch', seller.IdSeller);
      if (seller.Country === 'COLOMBIA') {
        this.isInternational = false;
      } else {
        this.isInternational = true;
      }
      this.sellerIdSearch = this.idSeller;
      const paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller
      };
      this.callOne = true;
      this.getOrdersList(paramsArray);
    });
  }

}
