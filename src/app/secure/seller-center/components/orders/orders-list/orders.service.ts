/* 3rd party components */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

/* our own custom components */
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../../shared/models/login.model';
import { BaseSellerService } from '../../../../../shared/services/base-seller.service';
import { Order } from '../../../../../shared/models/order';

@Injectable()
/**
 * Clase OrderService
 */
export class OrderService extends BaseSellerService {
  public sellerId = localStorage.getItem('sellerId');
  /**
   * Método para realiar la consulta de las ordenes
   * @param {any} state
   * @param {User} user
   * @param {any} limit
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrderList(state, user: User, limit): Observable<[{}]> {

    this.changeEndPoint();
    return new Observable(observer => {

      if (state !== undefined || state != null) {
        // tslint:disable-next-line:max-line-length
        this.http.get<Order[]>(this.api.get('searchOrders', [this.sellerId, limit + `&idStatusOrder=${state}`]), this.getHeaders(user)).subscribe((data: any) => {
          observer.next(data);
        }, err => {
          this.hehs.error(err, () => {
            observer.error(err);
          });
        });
      } else {
        this.http.get<Order[]>(this.api.get('searchOrders', [this.sellerId, limit]),
          this.getHeaders(user)).subscribe((data: any) => {
            observer.next(data);
          }, error => {
            this.hehs.error(error, () => {
              observer.error(error);
            });
          });
      }
    });
  }

  /**
   * Método para realiar la consulta de las ordenes de acuerdo a los filtros indicados.
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrdersFilter(user: User, limit, stringSearch): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.get(this.api.get('searchOrders', [this.sellerId, limit + stringSearch]),
        this.getHeaders(user)).subscribe((data: any) => {
          observer.next(data);
        }, errorMessage => {
          this.hehs.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }

  /**
   * Método para realiar el envío de los productos de una orden
   * @param {any} product
   * @param {any} token
   * @param {any} orderId
   * @param {any} idProduct
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  sendProductOrder(product, user, orderId, idProduct): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.patch(this.api.get('sendProductInOrder', [orderId, idProduct]), product, this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }

  /**
   * Método para realiar el envío de una orden
   * @param {any} orders
   * @param {any} token
   * @param {any} orderId
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  sendAllProductInOrder(orders, user, orderId): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.patch(this.api.get('sendAllProductInOrder', [orderId]), orders, this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }

  /**
   * Método para realiar la consulta de las transportadoras
   * @param {any} token
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getCarries(user): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.get(this.api.get('carries'), this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }

  /**
   * Método para realizar el check de una orden
   * @param {any} information
   * @param {any} access_token
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  recordProcesSedOrder(information, user): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.patch(this.api.get('recordProcesSedOrder'), information, this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }

  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de ordenes
   * @returns
   * @memberof OrderService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las ordenes que esta visualizando
   * @param {any} data
   * @memberof OrderService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }
}
