import { MenuModel } from '@app/secure/auth/auth.consts';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SearchFormEntity, UserInformation, InformationToForm, FraudEntity } from '@app/shared';
import { LoadingService, UserParametersService, Logger } from '@app/core';
import { ToolbarOptionsComponent } from '@app/shared/components';
import { ShellComponent } from '@app/core/shell';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FraudNotificationService } from './fraud-notification.service';


const log = new Logger('FraudNotificationComponent');

interface DataForm {
  fileName?: string;
  dateOrderInitial?: Date | string;
  dateOrderFinal?: Date | string;
}

@Component({
  selector: 'app-fraud-notification',
  templateUrl: './fraud-notification.component.html',
  styleUrls: ['./fraud-notification.component.scss']
})
export class FraudNotificationComponent implements OnInit {

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
  public subFilterFraudNotification: Subscription;

  public typeProfile: number;
  // Suscriptions vars
  public searchSubscriptionFraud: any;
  // Id del seller
  public idSeller: any;

  public event: any;

  public displayedColumns = [
    'name',
    'creationDate'
  ];


// Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Notificación de Fraudes',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'fraud-notification',
    information: new InformationToForm,
    count: null,
  };


  // Variable que almacena el estado de numero de fraudes
  public orderListLength = false;

  // Contendra la información para la tabla
  public dataSource: MatTableDataSource<FraudEntity>;
  // Cantidad de elementos en la tabla
  public numberElements = 0;
  public currentEventPaginate: any;

  public permissionComponent: MenuModel;

  public filterParamsFraud: DataForm;

  public paginationToken = '{}';
  lengthOrder = 0;
  isClear = false;
  public arrayPosition = [];
  dateOrderInitial = '';
  dateOrderFinal = '';
  fileName = '';
  public pageSize = 50;
  resolutionDate = '';
  public params: any;
  searchFraud: Boolean = true;

  /**
   * Creates an instance of FraudNotificationComponent.
   * @param {AuthService} authService
   * @param {FraudNotificationService} __fraudService:
   * @param {LoadingService} __loadingService
   * @param {MatDialog} dialog
   * @param {UserParametersService} userParams
   * @param {ShellComponent} shellComponent
   * @param {EventEmitterSeller} eventsSeller
   * @memberof FraudNotificationComponent
   */
  constructor(
    private __fraudService: FraudNotificationService,
    private __loadingService: LoadingService,
    public dialog: MatDialog,
    public userParams: UserParametersService,
    private shellComponent: ShellComponent,
    public eventsSeller: EventEmitterSeller,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.searchFraud = true;
    this.getDataUser();
    this.changeLanguage();
    this.clearData();
  }

  getFrauds() {
    this.searchSubscriptionFraud = this.eventsSeller.eventSearchFraud
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
    this.subFilterFraudNotification.unsubscribe();
  }

  /**
   * Traer el rol de usuario y lista el fraudes
   *
   * @memberof FraudNotificationComponent
   */
  public async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
  }

  /**
   * Método para obtener la lista de de fraudes.
   * @param $event
   * @memberof FraudNotificationComponent
   */
  public getOrdersList(params: any): void {
    const filter = this.filterParamsFraud;
    let stringSearch;
    if (filter && !_.isEmpty(filter)) {
      stringSearch = this.setParameters(params);
    } else {
      stringSearch = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`;
    }
    this.__loadingService.viewSpinner();
    this.__fraudService.getFraudList(stringSearch)
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
      this.dateOrderInitial = '';
      this.dateOrderFinal = '';
      this.fileName = '';
    }
    const paramsArray = {
      'limit': 'limit=' + this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
      'dateOrderInitial': this.dateOrderInitial,
      'dateOrderFinal': this.dateOrderFinal,
      'fileName': this.fileName,
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
      'dateOrderInitial': this.dateOrderInitial,
      'dateOrderFinal': this.dateOrderFinal,
      'fileName': this.fileName,
    };
    this.getOrdersList(params);
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof FraudNotificationComponent
   */
  changeSizeOrderTable($event: { paginator: MatPaginator, filter: any }): void {
  }

  /**
   * Método para cambiar el page size de la tabla órdenes
   *
   * @param {MatPaginator} $event
   * @memberof FraudNotificationComponent
   */
  changePageSizeTable($event: { paginator: MatPaginator, filter: DataForm }): void {
    this.event.lengthOrder = $event.paginator.pageSize;
    this.filterParamsFraud = $event.filter;
    this.getOrdersList(this.event);
  }

  
  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro del fraudes de devoluciones
   *
   * @memberof FraudNotificationComponent
   */
  private getOrdersListSinceFilterSearchOrder(): void {
    this.numberElements = 0;
    this.lengthOrder = 0;
    this.subFilterFraudNotification = this.shellComponent.eventEmitterOrders.fraudList
      .subscribe((data: FraudEntity[]) => {
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
   * @memberof FraudNotificationComponent
   */
  private clearData(): void {
    this.subFilterFraudNotification = this.shellComponent.eventEmitterOrders.clearTable.subscribe(() => {
      this.filterParamsFraud = undefined;
      this.getOrdersList(this.event);
    });
  }

  changeLanguage() {
    this.getFrauds();
    this.languageService.onLangChange.subscribe((e: Event) => {
      this.__loadingService.viewSpinner();
      localStorage.setItem('culture_current', e['lang']);
      this.getOrdersList(this.event);
      this.clearData();
    });
  }
}
