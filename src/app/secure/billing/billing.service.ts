import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Billing } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class BillingService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Método para realiar la consulta de las transportadoras.
   * 
   * @param {any} stringSearch
   * @returns {Observable<Billing[]>}
   * @memberof BillingService
   */
  getBilling(user, stringSearch): Observable<Billing[]> {
    return new Observable(observer => {
      this.http.get(this.api.get('getBilling', [stringSearch])).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   * Método para realiar la consulta de las órdenes de acuerdo a los filtros indicados.
   * 
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

      this.http.get<Billing[]>(this.api.get('searchBilling', [sellerId, limit + stringSearch])).subscribe((data) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
      });
    });
  }


  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes.
   * 
   * @returns
   * @memberof BillingService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando.
   * 
   * @param {any} data
   * @memberof BillingService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }
}
