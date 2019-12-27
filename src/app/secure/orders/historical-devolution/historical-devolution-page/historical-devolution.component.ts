import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuModel, historicDevolution } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from '@angular/material';
import { HistoricalDevolutionService } from '../historical-devolution.service';
import {
  HistoricalDevolutionEntity,
  SearchFormEntity,
  Const,
  UserInformation
} from '@app/shared';
import { LoadingService, UserParametersService, Logger } from '@app/core';
import { isEmpty } from 'lodash';
import { ViewCommentComponent } from '../view-comment/view-comment.component';
import { HistoricalDevolutionModalComponent } from '../historical-devolution-modal/historical-devolution-modal.component';
import { ToolbarOptionsComponent } from '@app/shared/components';

const log = new Logger('HistoricalDevolutionComponent');

@Component({
  selector: 'app-historical-devolution',
  templateUrl: './historical-devolution.component.html',
  styleUrls: ['./historical-devolution.component.scss']
})
export class HistoricalDevolutionComponent implements OnInit {
  // Elemento paginador
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) public sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild(ToolbarOptionsComponent)
  public toolbarOption: ToolbarOptionsComponent;

  public user: UserInformation;

  /** Columnas que se visulizaran en la tabla */
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

  public informationToForm: SearchFormEntity = {
    title: 'secure.orders.orders',
    subtitle: 'menu.Historico de devoluciones',
    btn_title: 'secure.orders.filter.title_filter',
    title_for_search: 'secure.orders.filter.title_filter',
    type_form: 'pending-devolution',
    information: {
      reversionRequestStatusId: Const.StatusPendingDevolution
    },
    count: ''
  };

  public orderListLength = false;

  // contendra la Información para la tabla
  public dataSource: MatTableDataSource<HistoricalDevolutionEntity>;
  public numberElements = 0;
  public currentEventPaginate: any;

  public permissionComponent: MenuModel;

  constructor(
    private authService: AuthService,
    private __historicalService: HistoricalDevolutionService,
    private __loadingService: LoadingService,
    public dialog: MatDialog,
    public userParams: UserParametersService
  ) {}

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(historicDevolution);
    this.getDataUser();
  }

  public async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.toolbarOption.getOrdersList();
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
  }) {
    if (!$event) {
      $event.lengthOrder = 100;
    }
    this.__loadingService.viewSpinner();
    this.__historicalService.getHistorical().subscribe(
      data => {
        this.__loadingService.closeSpinner();
        // guardo el filtro actual para la paginación.
        this.currentEventPaginate = $event;
        if (isEmpty(data)) {
          this.orderListLength = data.length === 0;
        }
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
   * @param {any} $event
   * @memberof HistoricalDevolutionComponent
   */
  changeSizeOrderTable($event) {
    this.dataSource.paginator = $event.paginator;
  }

  /**
   * Método para desplegar el modal para ver el comentario de la orden
   * @param item
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
}
