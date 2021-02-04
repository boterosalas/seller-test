import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { MenuModel, historicDevolution } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { HistoricalDevolutionService } from '../historical-devolution.service';
import { HistoricalDevolutionEntity, SearchFormEntity, Const, UserInformation } from '@app/shared';
import { LoadingService, UserParametersService, Logger } from '@app/core';
import { isEmpty } from 'lodash';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { HistoricalDevolutionModalComponent } from '../historical-devolution-modal/historical-devolution-modal.component';
import { ToolbarOptionsComponent } from '@app/shared/components';
import { ShellComponent } from '@app/core/shell';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const log = new Logger('HistoricalDevolutionComponent');

interface DataForm {
  dateReversionRequestInitial?: Date | string;
  dateReversionRequestFinal?: Date | string;
  resolutionDate?: Date | string;
  identificationCard?: string;
  orderNumber?: string;
  reversionRequestStatusId?: number;
}

/**
 * Componentes para visualizar el historico de devoluciones
 */
@Component({
  selector: 'app-historical-devolution',
  templateUrl: './historical-devolution.component.html',
  styleUrls: ['./historical-devolution.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state(
        'void',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class HistoricalDevolutionComponent implements OnInit, OnDestroy {
  // Elemento paginador
  @ViewChild(MatPaginator, {static: false}) public paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort, {static: false}) public sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild(ToolbarOptionsComponent, {static: false})
  public toolbarOption: ToolbarOptionsComponent;

  // User info
  public user: UserInformation;
  // Emmiter del filtro
  public subFilterHistoricalDevolution: Subscription;

  public typeProfile: number;
  // Suscriptions vars
  public searchSubscriptionHistoric: any;
  // Id del seller
  public idSeller: any;

  public event: any;

  public displayedColumns = [
    'orderNumber',
    'orderDate',
    'creationDate',
    'resolutionDate',
    'reversionRequestStatus',
    'reversionRequestReason',
    'comment',
    'detailOrder'
  ];

  // Configuración para el toolbar-options y el search del componente
  public informationToForm: SearchFormEntity = {
    title: 'menu.Devoluciones',
    subtitle: 'menu.Historico de devoluciones',
    btn_title: 'secure.orders.historical_devolutions.filter.title_filter',
    title_for_search: 'secure.orders.historical_devolutions.filter.title_filter',
    type_form: 'historical-devolution',
    information: {
      reversionRequestStatusId: Const.StatusHistoricDevolution
    },
    count: ''
  };

  // Variable que almacena el estado de numero de historico
  public orderListLength = false;

  // Contendra la información para la tabla
  public dataSource: MatTableDataSource<HistoricalDevolutionEntity>;
  // Cantidad de elementos en la tabla
  public numberElements = 0;
  public currentEventPaginate: any;

  public permissionComponent: MenuModel;

  public filterParamsHistoricoDevoluciones: DataForm;

  public paginationToken = '{}';
  lengthOrder = 0;
  isClear = false;
  public arrayPosition = [];
  dateReversionRequestInitial = '';
  dateReversionRequestFinal = '';
  identificationCard = '';
  orderNumber = '';
  public pageSize = 50;
  resolutionDate = '';
  public params: any;
  searchHistorical: Boolean = true;

  /**
   * Creates an instance of HistoricalDevolutionComponent.
   * @param {AuthService} authService
   * @param {HistoricalDevolutionService} __historicalService
   * @param {LoadingService} __loadingService
   * @param {MatDialog} dialog
   * @param {UserParametersService} userParams
   * @param {ShellComponent} shellComponent
   * @param {EventEmitterSeller} eventsSeller
   * @memberof HistoricalDevolutionComponent
   */
  constructor(
    private authService: AuthService,
    private __historicalService: HistoricalDevolutionService,
    private __loadingService: LoadingService,
    public dialog: MatDialog,
    public userParams: UserParametersService,
    private shellComponent: ShellComponent,
    public eventsSeller: EventEmitterSeller,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.searchHistorical = true;
    this.getDataUser();
    this.changeLanguage();
    this.clearData();
  }

  getAdminHistoric() {
    this.searchSubscriptionHistoric = this.eventsSeller.eventSearchSellerHistoric
      .subscribe((seller: StoreModel) => {
        this.changeLanguage();
        this.idSeller = seller.IdSeller;
        const paramsArray = {
          'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
          'callOne': true,
          'lengthOrder': 50
        };
        this.getOrdersList(paramsArray);
      });
  }

  ngOnDestroy() {
    this.subFilterHistoricalDevolution.unsubscribe();
  }

  /**
   * Traer el rol de usuario y lista el historico
   *
   * @memberof HistoricalDevolutionComponent
   */
  public async getDataUser() {
    this.user = await this.userParams.getUserData();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.authService.getMenuProfiel(historicDevolution, 0);
      this.typeProfile = 0;
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(historicDevolution, 1);
      this.typeProfile = 1;
    }
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
  }

  /**
   * Método para obtener la lista del historico.
   * @param $event
   * @memberof HistoricalDevolutionComponent
   */
  public getOrdersList(params: any): void {
    const filter = this.filterParamsHistoricoDevoluciones;
    let stringSearch;
    if (filter && !_.isEmpty(filter)) {
      stringSearch = this.setParameters(params);
    } else {
      stringSearch = `limit=${50}&paginationToken=${encodeURI(this.paginationToken)}&idSeller=${this.idSeller}&reversionRequestStatusId=${Const.StatusHistoricDevolution}`;
    }
    this.__loadingService.viewSpinner();
    this.__historicalService.getHistorical(stringSearch)
      .subscribe(data => {
        if (data && data['count'] > 0) {
          this.dataSource = new MatTableDataSource(data['viewModel']);
          this.orderListLength = false;
          this.savePaginationToken(data['paginationToken']);
          this.numberElements = this.dataSource.data.length;
          if (params && params.callOne) {
            this.lengthOrder = data['count'];
            this.isClear = true;
          }
          this.__loadingService.closeSpinner();
        } else {
          this.lengthOrder = 0;
          this.isClear = true;
          this.orderListLength = true;
          this.dataSource = new MatTableDataSource(null);
          this.__loadingService.closeSpinner();
        }
        this.dataSource.sort = this.sort;
      },
        () => {
          this.orderListLength = true;
        }
      );
  }

  setParameters(params: any) {
    if (params && params.callOne) {
      this.paginationToken = '{}';
      this.arrayPosition = [];
    }
    if (params && params.clear) {
      this.dateReversionRequestInitial = '';
      this.dateReversionRequestFinal = '';
      this.orderNumber = '';
      this.identificationCard = '';
    }
    const paramsArray = {
      'limit': 'limit=' + this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
      'idSeller': this.idSeller,
      'orderDate': this.dateReversionRequestInitial,
      'reversionDate': this.dateReversionRequestFinal,
      'orderNumber': this.orderNumber,
      'identificationCard': this.identificationCard,
      'resolutionDate': this.resolutionDate,
      'reversionRequestStatusId': Const.StatusHistoricDevolution
    };
    return paramsArray;
  }

  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }

  paginations(event: any) {
    const index = event.paginator.pageIndex;
    if (event.paginator.pageSize !== this.pageSize) {
      this.pageSize = event.paginator.pageSize;
      if (this.arrayPosition && this.arrayPosition.length > 0) {
        this.arrayPosition = [];
        this.isClear = true;
      }
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
      'limit': 'limit=' + this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
      'idSeller': this.idSeller,
      'orderDate': this.dateReversionRequestInitial,
      'reversionDate': this.dateReversionRequestFinal,
      'orderNumber': this.orderNumber,
      'identificationCard': this.identificationCard,
      'resolutionDate': this.resolutionDate,
      'reversionRequestStatusId': Const.StatusHistoricDevolution
    };
    this.getOrdersList(params);
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof HistoricalDevolutionComponent
   */
  changeSizeOrderTable($event: { paginator: MatPaginator, filter: any }): void {
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof HistoricalDevolutionComponent
   */
  changePageSizeTable($event: { paginator: MatPaginator, filter: DataForm }): void {
    this.event.lengthOrder = $event.paginator.pageSize;
    this.filterParamsHistoricoDevoluciones = $event.filter;
    this.getOrdersList(this.event);
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden
   *
   * @param {HistoricalDevolutionEntity} item
   * @memberof HistoricalDevolutionComponent
   */
  public openModalCommentOrder(item: any): void {
    const dialogRef = this.dialog.open(ViewCommentComponent, {
      width: '50%',
      data: {
        user: this.user,
        historical: item
      }
    });
    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      item.registryTranslations = val.registryTranslations;
    });
  }

  /**
   * Método para desplegar el modal de detallen de orden
   *
   * @param {HistoricalDevolutionEntity} item
   * @memberof HistoricalDevolutionComponent
   */
  public openModalDetailHistorical(item: HistoricalDevolutionEntity): void {
    const dialogRef = this.dialog.open(HistoricalDevolutionModalComponent, {
      data: {
        user: this.user,
        historical: item
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro del historico de devoluciones
   *
   * @memberof HistoricalDevolutionComponent
   */
  private getOrdersListSinceFilterSearchOrder(): void {
    this.numberElements = 0;
    this.lengthOrder = 0;
    this.subFilterHistoricalDevolution = this.shellComponent.eventEmitterOrders.filterHistoricalDevolutionWithStatus
      .subscribe((data: HistoricalDevolutionEntity[]) => {
        if (data && data['count'] > 0) {
          this.dataSource = new MatTableDataSource(data['viewModel']);
          this.orderListLength = false;
          this.savePaginationToken(data['paginationToken']);
          this.numberElements = this.dataSource.data.length;
          this.lengthOrder = data['count'];
          this.isClear = true;
        } else {
          this.lengthOrder = 0;
          this.isClear = true;
          this.orderListLength = true;
          this.dataSource = new MatTableDataSource(null);
        }
      });
  }

  /**
   * Restaura la tabla cuando el Filtro del ShellComponent se limpia.
   *
   * @private
   * @memberof HistoricalDevolutionComponent
   */
  private clearData(): void {
    this.subFilterHistoricalDevolution = this.shellComponent.eventEmitterOrders.clearTable.subscribe(() => {
      this.filterParamsHistoricoDevoluciones = undefined;
      this.getOrdersList(this.event);
    });
  }

  changeLanguage() {
    this.getAdminHistoric();
    this.languageService.onLangChange.subscribe((e: Event) => {
      this.__loadingService.viewSpinner();
      localStorage.setItem('culture_current', e['lang']);
      this.getOrdersList(this.event);
      this.clearData();
    });
  }
}
