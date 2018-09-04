import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { ListShipments, PickupShipment, Shipment } from '@app/shared';
import { Observable } from 'rxjs';
import { AnalyticsConfiguration } from 'aws-sdk/clients/s3';


@Injectable()
export class ShipmentsService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * @param {User} user
   * @param {number} id
   * @returns {Observable<Shipment>}
   */
  public getShipmentById(user: any, id: number) {

    return new Observable(observer => {
      this.http.get(this.api.get('getShipmentById', [id]))
        .subscribe((data: Shipment) => {
          observer.next(data);
        }, err => {
          observer.error(err);
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

    return new Observable(observer => {
      this.http.get(this.api.get('listShipments', [state, from, to, limit, offset, order, carrier]))
        .subscribe((data: ListShipments) => {
          observer.next(data);
        }, err => {
            observer.error(err);
        });
    });
  }

  pickupShipment(user: AnalyticsConfiguration, shipment: number) {

    return new Observable(observer => {
      this.http.post(this.api.get('pickupShipment', [shipment]), {})
        .subscribe((data: PickupShipment) => {
          observer.next(data);
        }, err => {
            observer.error(err);
        });
    });
  }
}
