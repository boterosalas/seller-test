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
  // Número de órdenes
  public orderListLength = false;
  //  user info
  public user: UserInformation;
  // suscriptions vars
  private subFilterOrderPending: any;

  permissionComponent: MenuModel;

  /**
   * Attribute that represent the read access
   */
  read = readFunctionality;
  // canRead = false;
  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Órdenes',
    subtitle: 'En Validación',
    btn_title: 'Consultar solicitudes',
    title_for_search: 'Consultar solicitudes',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusInValidation
    }
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
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(validationName);
    // this.getFunctionalities();
    this.getDataUser();
  }

  async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
    this.getOrdersListSinceFilterSearchOrder();
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
    const stringSearch = `limit=${$event.lengthOrder}&reversionRequestStatusId=${Const.StatusInValidation}`;
    this.loadingService.viewSpinner();
    this.inValidationService.getOrders(stringSearch).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      if (res != null) {
        if (res.length === 0) {
          this.orderListLength = true;
        } else {
          this.orderListLength = false;
        }
      }
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
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail order was closed');
    });
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden.
   *
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
