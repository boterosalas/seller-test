/* 3rd party components */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/* our own custom components */
import {environment} from '../../../../environments/environment';
import {BaseSellerService} from '../../../components/shared/services/base-seller.service';
import {User} from '../../../components/shared/models/login.model';


@Injectable()

export class SearchOrderMenuService extends BaseSellerService {

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
   * Método para setear el filtro actual que el usuario ha aplicado a las ordenes que esta visualizando
   * @param {any} data
   * @memberof OrderService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
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
      this.http.get(this.api.get('searchOrders', [user[environment.webUrl].sellerId, limit + stringSearch]),
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
   * Método para realiar la consulta de las ordenes pendientes de devolución de acuerdo a los filtros indicados.
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrdersPendingDevolutionFilter(user: User, limit, stringSearch): Observable<[{}]> {
    this.changeEndPoint();
    return new Observable(observer => {
      this.http.get(this.api.get('searchPendingDevolution', [user[environment.webUrl].sellerId, limit + stringSearch]),
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
