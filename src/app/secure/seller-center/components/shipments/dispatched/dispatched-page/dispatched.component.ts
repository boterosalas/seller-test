import { Component, OnInit, ViewChild } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginatorIntl, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

// Local components
import { ShipmentsService } from '../../shipments.service';
import { Logger } from '../../../../utils/logger.service';
import { getDutchPaginatorIntl } from '../../../../utils/services/common/components/mat-table.config';
import { User } from '../../../../../../shared/models/login.model';
import { environment } from '../../../../../../environments/environment';
import { SearchFormEntity, InformationToForm } from '../../../../../../shared/models/order';
import { UserService } from '../../../../utils/services/common/user/user.service';
import { ListShipments } from '../../../../../../shared/models/shipment.model';

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

  public displayedColumns = ['order', 'created_at', 'time_limit', 'remain', 'destination', 'state_id', 'service.carrier', 'actions'];

  public dataSource;

  public user: User;

  public url = environment.endpoints.shipments;

  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'Envíos en despacho',
    btn_title: 'Filtrar envíos',
    title_for_search: 'Consultar ordenes (Envios Éxito)',
    type_form: 'envios-exito',
    information: new InformationToForm
  };

  @ViewChild(MatSort) sort: MatSort;

  /**
   * Creates an instance of HistoricComponent.
   */
  constructor(private service: ShipmentsService,
    private userService: UserService) { }

  /**
   * Init compoment
   */
  ngOnInit() {
    log.info('PendingComponent is load');
    this.user = this.userService.getUser();

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
      // this.router.navigate(['/error']);
    });
  }

  /**
   * @param $event
   */
  changeSizeTable($event) { }
}
