/* 3rd party components */
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';

/* our own custom components */
import { BaseSellerService } from '@app/shared';

@Injectable()
/**
 * Clase OrderService
 */
export class DownloadOrderService extends BaseSellerService {

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
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }

  /**
   *  Método para realizar el consumo del servicio que permite enviar las órdenes al correo electronico del usuario
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  downloadOrders(user, stringSearch): Observable<[{}]> {
    this.changeEndPoint();
    return new Observable(observer => {
      this.http.post(this.api.get('downloadOrder'), stringSearch, this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }
}
