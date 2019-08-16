import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class SearchOrderMenuService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

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
  setCurrentFilterOrders(data: any) {
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
  getOrdersFilter(limit: any, stringSearch: any, idSeller: number): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('searchOrders', ['', limit + stringSearch + `&idSeller=${idSeller}`])).subscribe((data: any) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
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
  getOrdersPendingDevolutionFilter(limit: any, stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('searchPendingDevolution', ['', limit + stringSearch])).subscribe((data: any) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
      });
    });
  }
}
