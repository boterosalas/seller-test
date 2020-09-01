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
import { DownloadBillingpayModalComponent } from '../download-billingpay-modal/download-billingpay-modal.component';

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
  billingType: any;

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
  activeSearch: Boolean = false;
  paramsArray: any;
  // variable que me dice si hay datos o no.
  noData: boolean;
  paymentDateInitial: string;
  paymentDateFinal: string;

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
    this.getAllDataUser();
  }

  /**
   * @memberof BillingComponent
   */
  ngOnInit() {
    this.eventEmitSearch();

    this.route.params.subscribe(params => {
      if (params['listBilling'] != null) {
        this.getOrdersList(null, `&billingNumber=${params['listBilling']}`);
        this.myform.controls['billingNumber'].setValue(params['listBilling']);
      } else {
        this.userService.isAuthenticated(this);
      }
    });

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

  /**
   * Función para limpiar formulario.
   * @memberof BillingComponent
   */
  clearForm() {
    this.noData = false;
    this.callOne = true;
    this.keywords = [];
    this.myform.reset();
    if (this.activeSearch) {
      this.getOrdersList(this.paramsArray);
    } else {
      this.getOrdersList();
    }
  }

  /**
   * Metodo para filtrar pagos.
   * @memberof BillingComponent
   */
  filterOrder() {
    this.callOne = true;
    this.dataSource = null;
    // Formatear la fechas.
    const datePipe = new DatePipe(this.locale);

    // Formatear la fechas.
    this.paymentDateInitial = datePipe.transform(this.myform.controls.paymentDateInitial.value, 'yyyy/MM/dd');
    this.paymentDateFinal = datePipe.transform(this.myform.controls.paymentDateFinal.value, 'yyyy/MM/dd');

    // String que indicara los parametros de la consulta.
    let stringSearch = '';
    const objectSearch: any = {};

    if (!isEmpty(this.paymentDateInitial) && !isEmpty(this.paymentDateFinal)) {
      // paymentDateInitial
      stringSearch += `&paymentDateInitial=${this.paymentDateInitial}`;
      objectSearch.paymentDateInitial = this.paymentDateInitial;
      // paymentDateFinal
      stringSearch += `&paymentDateFinal=${this.paymentDateFinal}`;
      objectSearch.paymentDateFinal = this.paymentDateFinal;
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

  /**
   * Método que carga los datos del vendedor
   * @memberof BillingComponent
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile !== 'seller') {
      this.setPermission(1);
      this.activeSearch = true;
    } else {
      this.activeSearch = false;
      this.idSeller = this.user.sellerId;
      this.getOrdersList();
      this.setPermission(0);
    }
  }

  setPermission(typeProfile: number) {
    // Permisos del componente.
    this.typeProfile = typeProfile;
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
      sellerid = $event.idSeller;
      limit = $event.limit;
    } else {
      sellerid = this.idSeller;
      limit = this.pageSize + '&paginationToken=' + encodeURI('{}');
    }
    let stringSearch = `?idSeller=${sellerid}&limit=${limit}`;
    if (paramsFIlter) {
      this.callOne = true;
      stringSearch = `?idSeller=${sellerid}&limit=${limit}${paramsFIlter}`;

    }
    this.billinService.getBilling(stringSearch).subscribe((res) => {
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
        if (res['viewModel']) {
          this.noData = false;
          this.dataSource = new MatTableDataSource(res['viewModel']);
        } else {
          this.noData = true;
        }

        // se reccorre la respuesta de la lista y se pone la comision en negativo
        if (this.dataSource) {
          this.dataSource.data.forEach(element => {
            element.commission *= -1;
          });
          this.numberElements = this.dataSource.data.length;
          this.dataSource.sort = this.sort;
        }
        this.loadingService.closeSpinner();
      } else {
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


  /**
   * Metodo para validar si el usuarioe está logueado
   * @param {string} message
   * @param {boolean} isLoggedIn
   * @memberof BillingComponent
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

  /**
   * Evento que escucha el buscador y trae información del seller
   * @memberof BillingComponent
   */
  eventEmitSearch() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      this.nameSeller = seller.Name;
      this.onlyOne = true;
      this.activeSearch = true;
      localStorage.setItem('sellerIdSearch', seller.IdSeller);
      if (seller.Country === 'COLOMBIA') {
        this.isInternational = false;
      } else {
        this.isInternational = true;
      }
      this.sellerIdSearch = this.idSeller;
      this.paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller
      };
      this.callOne = true;
      this.getOrdersList(this.paramsArray);
    });
  }

  openModalDownloadBillPay(): void {
    const dataTosend = {
      paymentDateInitial: this.paymentDateInitial,
      paymentDateFinal: this.paymentDateFinal,
      idSeller: this.idSeller,
      billingNumber: this.myform.controls.billingNumber.value,
      orderNumber: this.keywords.toString(),
      email: null
    };
    const dialogRef = this.dialog.open(DownloadBillingpayModalComponent, {
      data: {
        dataTosend
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

}
