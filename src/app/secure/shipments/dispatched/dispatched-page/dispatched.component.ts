import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

import { Logger } from '@app/core';
import { getDutchPaginatorIntl, InformationToForm, ListShipments, RoutesConst, SearchFormEntity } from '@app/shared';

import { ShipmentsService } from '../../shipments.service';


/**
 * Servicio de log empleado para mostrar mensajes en consola
 */
const log = new Logger('DispatchedComponent');

@Component({
  selector: 'app-dispatched',
  templateUrl: './dispatched.component.html',
  styleUrls: ['./dispatched.component.scss'],
  // Configuración para la páginación de la tabla animations:
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }],
})


export class DispatchedComponent implements OnInit {
  public displayedColumns = [
    'order',
    'created_at',
    'time_limit',
    'remain',
    'destination',
    'state_id',
    'service.carrier',
    'actions'
  ];
  public dataSource;
  public user: any;
  // Configuración para el toolbar-options y el search de la página.
  public informationToForm: SearchFormEntity = {
    title: 'Envíos en despacho',
    subtitle: 'Envíos en despacho',
    btn_title: 'Filtrar envíos',
    title_for_search: 'Consultar órdenes (Envios Éxito)',
    type_form: 'envios-exito',
    information: new InformationToForm
  };
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private service: ShipmentsService,
    private router: Router) {
  }

  ngOnInit() {
    // this.user = this.userService.getUser();
    this.list();
  }

  /**
   * get Shipment by id in view
   */
  list(from?: string, to?: string, limit?: number, take?: number) {
    this.service.listShipments(this.user, 'outbox', from, to, limit, take).subscribe((res: ListShipments) => {
      this.dataSource = new MatTableDataSource(res.dataset);
    }, err => {
      log.error(err);
      this.router.navigate([`/${RoutesConst.error}`]);
    });
  }

  /**
   * @param $event
   */
  changeSizeTable($event: any) {
  }
}
