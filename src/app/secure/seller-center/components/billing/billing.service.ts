import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
// Local
import { environment } from '../../../../environments/environment';
import { User } from '../../../../shared/models/login.model';
import { BaseSellerService } from '../../../../shared/services/base-seller.service';


@Injectable()

/**
 * Clase BillingService
 */
export class BillingService extends BaseSellerService {

  /**
   * Método para realiar la consulta de las transportadoras
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof BillingService
   */
  getBilling(user, stringSearch): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {
      this.http.get(this.api.get('getBilling', [stringSearch]), this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        this.hehs.error(error, () => {
          observer.error(error);
        });
      });
    });
  }

  /**
   * Método para realiar la consulta de las ordenes de acuerdo a los filtros indicados.
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof BillingService
   */
  getOrdersBillingFilter(user: User, limit, stringSearch): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {
      this.http.get(this.api.get('searchBilling',
        [user[environment.webUrl].sellerId, limit + stringSearch]),
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
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de ordenes
   * @returns
   * @memberof BillingService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las ordenes que esta visualizando
   * @param {any} data
   * @memberof BillingService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }
}
