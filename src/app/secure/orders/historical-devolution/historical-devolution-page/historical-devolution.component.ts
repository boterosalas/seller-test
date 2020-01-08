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

const log = new Logger('HistoricalDevolutionComponent');

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
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) public sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild(ToolbarOptionsComponent)
  public toolbarOption: ToolbarOptionsComponent;

  // User info
  public user: UserInformation;
  // Emmiter del filtro
  public subFilterHistoricalDevolution: EventEmitter<any>;

  public typeProfile: number;
  // Suscriptions vars
  public searchSubscription: any;
  // Id del seller
  public idSeller: any;

  public event: any;

  public displayedColumns = [
    'orderNumber',
    'orderDate',
    'creationDate',
    // 'maximumDeliveryDate',
    'reversionRequestStatus',
    'reversionRequestReason',
    // 'comment',
    'detailOrder'
  ];

  // Configuración para el toolbar-options y el search del componente
  public informationToForm: SearchFormEntity = {
    title: 'module.Órdenes',
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
    public eventsSeller: EventEmitterSeller
  ) {}

  ngOnInit() {
    this.getDataUser();
    this.searchSubscription = this.eventsSeller.eventSearchSeller
      .subscribe((seller: StoreModel) => {
        this.idSeller = seller.IdSeller;
        if (this.event) {
          this.getOrdersList(this.event);
        }
      });
    this.clearData();
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
  public getOrdersList($event: {
    lengthOrder: number;
    paginator: MatPaginator;
    category: any;
  }): void {
    if (!$event) {
      $event.lengthOrder = 100;
    }

    this.event = $event;

    const stringSearch = `limit=${$event.lengthOrder}&idSeller=${this.idSeller}&reversionRequestStatusId=${Const.StatusHistoricDevolution}`;

    this.__loadingService.viewSpinner();
    this.__historicalService.getHistorical(stringSearch)
      .subscribe(data => {
        this.__loadingService.closeSpinner();
        // guardo el filtro actual para la paginación.
        this.currentEventPaginate = $event;

        this.orderListLength = isEmpty(data) ? true : false;
        // Creo el elemento que permite pintar la tabla
        this.dataSource = new MatTableDataSource(data);

        // this.paginator.pageIndex = 0;
        this.dataSource.paginator = $event.paginator;
        this.dataSource.sort = this.sort;
        this.numberElements = this.dataSource.data.length;
      },
        () => {
          this.orderListLength = true;
          // log.error(this.dataSource);
        }
      );
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof HistoricalDevolutionComponent
   */
  changeSizeOrderTable($event: MatPaginator): void {
    this.changePageSizeTable($event);
    this.dataSource.paginator = $event;
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof HistoricalDevolutionComponent
   */
  changePageSizeTable($event: MatPaginator): void {
    this.event.lengthOrder = $event.pageSize;
    this.getOrdersList(this.event);
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden
   *
   * @param {HistoricalDevolutionEntity} item
   * @memberof HistoricalDevolutionComponent
   */
  public openModalCommentOrder(item: HistoricalDevolutionEntity): void {
    const dialogRef = this.dialog.open(ViewCommentComponent, {
      width: '50%',
      data: {
        user: this.user,
        historical: item
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      log.info('The modal comment order was closed');
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
    this.subFilterHistoricalDevolution = this.shellComponent.eventEmitterOrders.filterHistoricalDevolutionWithStatus
      .subscribe((data: HistoricalDevolutionEntity[]) => {
        if (data !== null) {
          this.orderListLength = data.length === 0;
          this.dataSource = new MatTableDataSource(data);

          const paginator = this.toolbarOption.getPaginator() as any;
          paginator.pageIndex = 0;
          this.dataSource.paginator = paginator;
          this.dataSource.sort = this.sort;
          this.numberElements = this.dataSource.data.length;
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
    this.subFilterHistoricalDevolution = this.shellComponent.eventEmitterOrders.clearTable.subscribe(() => this.getOrdersList(this.event));
  }
}
