import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger, UserParametersService } from '@app/core';
import { Const, Pending, SearchFormEntity, UserInformation } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

import { InValidationModalComponent } from '../in-validation-modal/in-validation-modal.component';
import { InValidationService } from '../in-validation.service';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { LoadingService } from '@app/core/global/loading/loading.service';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, validationName, readFunctionality } from '@app/secure/auth/auth.consts';
import { TranslateService } from '@ngx-translate/core';

import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

// log component
const log = new Logger('InValidationComponent');

/**
 * Component para visualizar las órdenes en estado en validación.
 */
@Component({
  selector: 'app-in-validation',
  templateUrl: './in-validation.component.html',
  styleUrls: ['./in-validation.component.scss'],
  providers: [InValidationService],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class InValidationComponent implements OnInit, OnDestroy {

  // Elemento paginador
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions', {static: false}) toolbarOption;
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
  private searchSubscription: any;
  // contendra la Información para la tabla
  public dataSource: MatTableDataSource<any>;
  // Método para el check de la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Número de órdenes
  public orderListLength = false;
  //  user info
  public user: UserInformation;
  // suscriptions vars
  private subFilterOrderPending: any;

  currentLanguage: string;
  event: any;

  permissionComponent: MenuModel;
  readPermission: any;
  typeProfile: any;
  idSeller: number;

  // canRead = false;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'menu.Devoluciones',
    subtitle: 'secure.orders.list-cancels.tab1',
    btn_title: 'secure.orders.filter.title_filter',
    title_for_search: 'secure.orders.filter.title_filter',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusInValidation
    },
    count: ''
  };

  constructor(
    public shellComponent: ShellComponent,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private zone: NgZone,
    private inValidationService: InValidationService,
    public userParams: UserParametersService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private languageService: TranslateService,
    public eventsSeller: EventEmitterSeller,
  ) { }

  ngOnInit() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      if (this.event) {
        this.getOrdersList(this.event);
      }
    });
    this.getDataUser();
    this.clearData();
    this.changeLanguage();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
    if (this.user.sellerProfile === 'seller') {
      this.permissionComponent = this.authService.getMenuProfiel(validationName, 0);
      this.setPermission(0);
    } else {
      this.permissionComponent = this.authService.getMenuProfiel(validationName, 1);
      this.setPermission(1);
    }
  }

  setPermission(typeProfile: number) {
    this.typeProfile = typeProfile;
    this.readPermission = this.getFunctionality(readFunctionality);
  }
/**
 * funcion para escuchar el evento al cambiar de idioma
 *
 * @memberof InValidationComponent
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
    });
  }

  clearData() {
    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.clearTable.subscribe(
      (data: any) => {
        this.getOrdersList(this.event);
      });
  }


  ngOnDestroy() {
    // Remover las suscripciones creadas.
    this.subFilterOrderPending.unsubscribe();
  }

  /**
   * MEthod that get the permissions for the component
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
}

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar
   * el filtro de órdenes en la opcion se arch-order-menu.
   *
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {
    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders
      .filterOrdersWithStatus.subscribe(
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
   * @param {any} $event
   * @memberof InValidationComponent
   */
  changeSizeOrderTable($event: any) {
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para obtener la lista de órdenes.
   *
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  getOrdersList($event: any) {
    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    this.event = $event;
    const stringSearch = `limit=${$event.lengthOrder}&idSeller=${this.idSeller}&reversionRequestStatusId=${Const.StatusPendingCancels}`;
    this.loadingService.viewSpinner();
    this.inValidationService.getOrders(stringSearch).subscribe((res: any) => {
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res.viewModel);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
      this.loadingService.closeSpinner();
    }, err => {
      this.orderListLength = true;
      log.error(this.dataSource);
    });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   * @returns
   * @memberof InValidationComponent
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   * @memberof InValidationComponent
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Filtro para la tabla
   *
   * @param {string} filterValue
   * @memberof InValidationComponent
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  /**
   * Método para desplegar el modal de detallen de orden.
   *
   * @param {any} item
   * @memberof InValidationComponent
   */
  openModalDetailOrder(item: any): void {
    const dialogRef = this.dialog.open(InValidationModalComponent, {
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
}
