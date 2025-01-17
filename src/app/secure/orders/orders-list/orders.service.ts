import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Order } from '@app/shared';
import { Observable } from 'rxjs/Observable';

@Injectable()
/**
 * Clase OrderService
 */
export class OrderService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Método para realiar la consulta de las órdenes
   * @param {any} state
   * @param {User} user
   * @param {any} limit
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrderList(params: any): Observable<[{}]> {
    let filter = '';
    if (params) {
      if ( params.dateOrderInitial && params.dateOrderInitial !== '') {
        filter += `&dateOrderInitial=${params.dateOrderInitial}`;
      }
      if (params.dateOrderFinal && params.dateOrderFinal !== '') {
        filter += `&dateOrderFinal=${params.dateOrderFinal}`;
      }
      if (params.idChannel && params.idChannel !== '') {
        filter += `&idChannel=${params.idChannel}`;
      }

      if (params.orderNumber && params.orderNumber !== '') {
        filter += `&orderNumber=${params.orderNumber}`;
      }
      if (params.identificationCard && params.identificationCard !== '') {
        filter += `&identificationCard=${params.identificationCard}`;
      }
      if (params.processedOrder && params.processedOrder !== '') {
        filter += `&processedOrder=${params.processedOrder}`;
      }

      if (params.state && params.state !== '') {
        filter += `&idStatusOrder=${params.state}`;
      }
    }

    return new Observable(observer => {
      this.http.get<Order[]>(this.api.get('searchOrders', [params.idSeller, params.limit + filter ])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }

  /**
   * Método para realiar la consulta de las órdenes de acuerdo a los filtros indicados.
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getOrdersFilter(limit: any, stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('searchOrders', ['', limit + stringSearch]),
      ).subscribe((data: any) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
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
  sendProductOrder(product: any, orderId: any, idProduct: any): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('sendProductInOrder', [orderId, idProduct]), product, { observe: 'response' })
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
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
  sendAllProductInOrder(orders: any, orderId: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.patch(this.api.get('sendAllProductInOrder', [orderId]), orders).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }

  /**
   * Método para realiar la consulta de las transportadoras
   * @param {any} token
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getCarries(): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('carries')).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
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
  recordProcesSedOrder(information: any): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('recordProcesSedOrder'), information, { observe: 'response' })
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes
   * @returns
   * @memberof OrderService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
   * @param {any} data
   * @memberof OrderService
   */
  setCurrentFilterOrders(data: any) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }

  /**
   * Servicio que descarga el rotulo
   * @param {*} params
   * @returns {Observable<{}>}
   * @memberof OrderService
   */
  public getDownlaodLabel(params: any): Observable<{}> {
    return this.http.get(this.api.get('getDownlaodLabel', [params]), { observe: 'response' });
  }
}
