// Angular
import { Component, OnInit } from '@angular/core';

// Local components
import { MatTableDataSource } from '@angular/material';
import { ShipmentsService } from '../../shipments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger, Shipment, UserService, RoutesConst } from '@app/shared';

/**
 * Servicio de log empleado para mostrar mensajes en consola
 */
const log = new Logger('DispatchedComponent');

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit {
  public id: number;

  public user: any;

  public subStateOrder: any;

  private shipment: Shipment;

  /**
   * Creates an instance of HistoricComponent.
   */
  constructor(private service: ShipmentsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  /**
   * Init compoment
   */
  ngOnInit() {
    this.user = this.userService.getUser();

    this.subStateOrder = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id === undefined) {
        this.router.navigate([`/${RoutesConst.error}`]);
      } else {
        this.getShipment();
      }
    });
  }

  getOrdersList($event) {

  }

  /**
   * get Shipment by id in view
   */
  getShipment() {
    this.service.getShipmentById(this.user, this.id).subscribe((res: Shipment) => {
      this.shipment = res;
    }, err => {
      log.error(err);
      this.router.navigate(['/error']);
    });
  }

}