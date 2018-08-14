import { Injectable } from '@angular/core';

import { BaseSellerService } from '@app/shared';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class SearchOrderMenuService extends BaseSellerService {

  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes
   *
   * @returns
   * @memberof OrderService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Método para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
   *
   * @param {any} data
   * @memberof OrderService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }

  /**
   * Método para realiar la consulta de las órdenes de acuerdo a los filtros indicados.
   *
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrdersFilter(user: any, limit, stringSearch): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {
      this.http.get(this.api.get('searchOrders', [user.sellerId, limit + stringSearch]),
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
   * Método para realiar la consulta de las órdenes pendientes de devolución de acuerdo a los filtros indicados.
   *
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrdersPendingDevolutionFilter(user: any, limit, stringSearch): Observable<[{}]> {
    this.changeEndPoint();
    return new Observable(observer => {
      this.http.get(this.api.get('searchPendingDevolution', [user.sellerId, limit + stringSearch]),
        this.getHeaders(user)).subscribe((data: any) => {
          observer.next(data);
        }, errorMessage => {
          this.hehs.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }
}
