import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Local
import { Billing, BaseSellerService } from '@app/shared';

@Injectable()

/**
 * Clase BillingService
 */
export class BillingService extends BaseSellerService {

  /**
   * Método para realiar la consulta de las transportadoras
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<Billing[]>}
   * @memberof BillingService
   */
  getBilling(user, stringSearch): Observable<Billing[]> {
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
   * Método para realiar la consulta de las órdenes de acuerdo a los filtros indicados.
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<Billing[]>}
   * @memberof BillingService
   */
  getOrdersBillingFilter(user: any, limit, stringSearch): Observable<Billing[]> {
    return new Observable(observer => {
      // Id del vendedor.
      const sellerId = user.sellerId;

      this.http.get<Billing[]>(this.api.get('searchBilling', [sellerId, limit + stringSearch]),
        this.getHeaders()).subscribe((data) => {
          observer.next(data);
        }, errorMessage => {
          this.hehs.error(errorMessage, () => {
            observer.error(errorMessage);
          });
        });
    });
  }


  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes
   * @returns
   * @memberof BillingService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
   * @param {any} data
   * @memberof BillingService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }
}
