import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuModel, historicDevolution } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { HistoricalDevolutionService } from '../historical-devolution.service';
import {
  HistoricalDevolutionEntity,
  SearchFormEntity,
  Const
} from '@app/shared';
import { LoadingService } from '@app/core';
import { isEmpty } from 'lodash';

@Component({
  selector: 'app-historical-devolution',
  templateUrl: './historical-devolution.component.html',
  styleUrls: ['./historical-devolution.component.scss']
})
export class HistoricalDevolutionComponent implements OnInit {
  // Elemento paginador
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Sort: elemento que se emplea para poder organizar los elementos de la tabla de acuerdo a la columna seleccionada
  @ViewChild(MatSort) sort: MatSort;
  // Toolbar Options Componente: Permite acceder a los metodos de este compomente
  @ViewChild('toolbarOptions') toolbarOption;
  // Columnas que se visualizan en la tabla

  public displayedColumns = [
    'orderNumber',
    'orderDate',
    'creationDate',
    'maximumDeliveryDate',
    'reversionRequestReason'
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

  permissionComponent: MenuModel;
  currentEventPaginate: any;

  constructor(
    private authService: AuthService,
    private __historicalService: HistoricalDevolutionService,
    private __loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(historicDevolution);
    this.toolbarOption.getOrdersList();
    // this.getHistorical();
  }

  getHistorical() {
    this.__historicalService.getHistorical().subscribe(data => {
      console.log(data);
      this.orderListLength = data.length === 0;
      this.dataSource = new MatTableDataSource(data);
      console.log(this.dataSource);
    });
  }

  /**
   * Método para obtener la lista de órdenes.
   * @param {any} $event
   * @memberof PendingDevolutionComponent
   */
  getOrdersList($event) {
    if (!$event) {
      $event = {
        lengthOrder: 100
      };
    }
    const stringSearch = `limit=${$event.lengthOrder}&reversionRequestStatusId=${Const.StatusPendingDevolution}`;
    this.__loadingService.viewSpinner();

    this.__historicalService.getHistorical().subscribe(
      res => {
        this.__loadingService.closeSpinner();
        // guardo el filtro actual para la paginación.
        this.currentEventPaginate = $event;
        if (isEmpty(res)) {
          this.orderListLength = res.length === 0;
        }
        // Creo el elemento que permite pintar la tabla
        this.dataSource = new MatTableDataSource(res);
        console.log(this.dataSource);

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
   * @memberof PendingDevolutionComponent
   */
  changeSizeOrderTable($event) {
    this.dataSource.paginator = $event.paginator;
  }
}
