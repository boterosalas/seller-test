import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ListShipments, PickupShipment, Shipment, BaseShipmentService } from '@app/shared';
import { AnalyticsConfiguration } from '../../../../node_modules/aws-sdk/clients/s3';

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
  public getShipmentById(user: any, id: number) {

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
  public listShipments(user: any, state: any = 'all', from: string = 'all',
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

  pickupShipment(user: AnalyticsConfiguration, shipment: number) {

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
