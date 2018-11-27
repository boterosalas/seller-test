import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Clase OrderService
 */
export class DownloadOrderService {

  constructor (
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes.
   * 
   * @returns
   * @memberof OrderService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando.
   * 
   * @param {any} data
   * @memberof OrderService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }

  /**
   *  Método para realizar el consumo del servicio que permite enviar las órdenes
   *  al correo electronico del usuario.
   * 
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  downloadOrders(stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.post(this.api.get('downloadOrder'), stringSearch).subscribe((data: any) => {
        observer.next(data);
      }, err => {
          observer.error(err);
      });
    });
  }

  /**
   *  Método para realizar el consumo del servicio que permite enviar las órdenes
   *  al correo electronico del usuario.
   * 
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  downloadBilling(stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.post(this.api.get('exportBilling'), stringSearch).subscribe((data: any) => {
        observer.next(data);
      }, err => {
          observer.error(err);
      });
    });
  }
}
