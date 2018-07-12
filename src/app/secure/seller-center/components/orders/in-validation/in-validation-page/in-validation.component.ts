/* 3rd party components */
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

/* our own custom components */
import { environment } from '../../../../../../environments/environment';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { InValidationService } from '../in-validation.service';
import { InValidationModalComponent } from '../in-validation-modal/in-validation-modal.component';
import { Logger } from '../../../../utils/logger.service';
import { Pending, SearchFormEntity } from '../../../../../../shared/models/order';
import { User } from '../../../../../../shared/models/login.model';
import { Const } from '../../../../../../shared/util/constants';
import { UserService } from '../../../../utils/services/common/user/user.service';
import { ShellComponent } from '../../../../shell/shell.component';

// log component
const log = new Logger('InValidationComponent');

/**
 * Component para visualizar las ordenes en estado en validación
 */
@Component({
  selector: 'app-in-validation',
  templateUrl: './in-validation.component.html',
  styleUrls: ['./in-validation.component.scss'],
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
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
  // contendra la Información para la tabla
  public dataSource: MatTableDataSource<any>;
  // Método para el check de la tabla
  public selection = new SelectionModel<Pending>(true, []);
  // Variable que almacena el numero de elementos de la tabla
  public numberElements = 0;
  // Número de ordenes
  public orderListLength = false;
  //  user info
  public user: User;
  // suscriptions vars
  private subFilterOrderPending: any;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'En Validación',
    btn_title: 'Consultar solicitudes',
    title_for_search: 'Consultar solicitudes',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusInValidation
    }
  };
  /**
   * Creates an instance of InValidationComponent.
   * @param {ShellComponent} shellComponent
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {MatDialog} dialog
   * @param {NgZone} zone
   * @param {inValidationService} inValidationService
   * @param {UserService} userService
   * @memberof InValidationComponent
   */
  constructor(
    public shellComponent: ShellComponent,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private zone: NgZone,
    private inValidationService: InValidationService,
    public userService: UserService
  ) {
  }

  /**
   * ngOnInit
   *
   * @memberof InValidationComponent
   */
  ngOnInit() {
    log.info('Devoluciones pendientes component load');
    this.getDataUser();
    // obtengo las ordenes con la función del componente ToolbarOptionsComponent
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
  }


  /**
   * Funcionalidad para remover las suscripciones creadas.
   *
   * @memberof BillingComponent
   */
  ngOnDestroy() {
    // this.subOrderList.unsubscribe();
    this.subFilterOrderPending.unsubscribe();
  }

  /**
   * Funcionalidad encargada de traer la información del usuario que se encuentra almacenada en localstorage.
   *
   * @memberof BillingComponent
   */
  getDataUser() {
    this.user = this.userService.getUser();
    if (this.user.login === undefined) {
      this.userService.setUser([]);
    }
  }

  /**
   * Evento que permite obtener los resultados obtenidos al momento de realizar el filtro de ordenes en la opcion search-order-menu
   *
   * @memberof OrdersListComponent
   */
  getOrdersListSinceFilterSearchOrder() {

    this.subFilterOrderPending = this.shellComponent.eventEmitterOrders.filterOrdersWithStatus.subscribe(
      (data: any) => {
        log.info(data);
        // log.info("Aplicando resultados obtenidos por el filtro")
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
   * Método para cambiar el page size de la tabla ordenes
   * @param {any} $event
   * @memberof InValidationComponent
   */
  changeSizeOrderTable($event) {
    log.info($event);
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para obtener la lista de ordenes.
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  getOrdersList($event) {

    if ($event == null) {
      $event = {
        lengthOrder: 100
      };
    }
    // tslint:disable-next-line:max-line-length
    const stringSearch = `?idSeller=${localStorage.getItem('sellerId')}&limit=${$event.lengthOrder}&reversionRequestStatusId=${Const.StatusInValidation}`;

    this.inValidationService.getOrders(this.user, stringSearch).subscribe((res: any) => {
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
      log.info(res);
      // Creo el elemento que permite pintar la tabla
      this.dataSource = new MatTableDataSource(res);
      // this.paginator.pageIndex = 0;
      this.dataSource.paginator = $event.paginator;
      this.dataSource.sort = this.sort;
      this.numberElements = this.dataSource.data.length;
    }, err => {
      this.orderListLength = true;
      log.error(this.dataSource);
    });
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
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
   * @memberof InValidationComponent
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Filtro para la tabla
   * @param {string} filterValue
   * @memberof InValidationComponent
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  /**
   * Método para desplegar el modal de detallen de orden
   * @param {any} item
   * @memberof InValidationComponent
   */
  openModalDetailOrder(item): void {
    const dialogRef = this.dialog.open(InValidationModalComponent, {
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden
   * @param item
   */
  openModalCommentOrder(item): void {
    const dialogRef = this.dialog.open(ViewCommentComponent, {
      width: '50%',
      data: {
        user: this.user,
        order: item
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal comment order was closed');
    });
  }
}
