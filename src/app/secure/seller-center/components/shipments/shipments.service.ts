// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { ListShipments, PickupShipment, Shipment } from '../../../../shared/models/shipment.model';
import { BaseShipmentService } from '../../../../shared/services/base-shipments.service';
import { User } from '../../../../shared/models/login.model';

/**
 * Injectable
 */
@Injectable()
export class ShipmentsService extends BaseShipmentService {
  /**
   * @param {User} user
   * @param {number} id
   * @returns {Observable<Shipment>}
   */
  public getShipmentById(user: User, id: number) {

    this.changeEndPoint();
    return new Observable(observer => {
      this.http.get(this.api.get('getShipmentById', [id]), this.getHeaders(user))
        .subscribe((data: Shipment) => {
          observer.next(data);
        }, errorMessage => {
          this.error.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }

  /**
   * @param {User} user
   * @param {any} state
   * @param {any} from
   * @param {any} to
   * @param {any} limit
   * @param {any} offset
   * @param {any} order
   * @param {any} carrier
   * @returns {Observable<ListShipments>}
   */
  public listShipments(user: User, state: any = 'all', from: string = 'all',
    to: string = 'all', limit: any = 'all', offset: any = 'all', order: string = 'all', carrier: any = 'all') {

    this.changeEndPoint();
    return new Observable(observer => {
      this.http.get(this.api.get('listShipments', [state, from, to, limit, offset, order, carrier]), this.getHeaders(user))
        .subscribe((data: ListShipments) => {
          observer.next(data);
        }, errorMessage => {
          this.error.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }

  pickupShipment(user: User, shipment: number) {

    this.changeEndPoint();
    return new Observable(observer => {
      this.http.post(this.api.get('pickupShipment', [shipment]), this.getHeaders(user))
        .subscribe((data: PickupShipment) => {
          observer.next(data);
        }, errorMessage => {
          this.error.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }
}
