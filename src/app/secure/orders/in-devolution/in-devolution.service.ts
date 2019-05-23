import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Const, ListReasonRejectionResponseEntity } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class InDevolutionService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Método para realiar la consulta de las órdenes en estado pendiente.
   * 
   * @param guide
   * @returns Observable<[{}]>
   */
  getOrders(stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('pendingDevolution', [stringSearch]))
        .subscribe((data: any) => {
          // Validación debido a que a veces el endpoint solo responde un status 200.
          data = (!data) ? [] : data;
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

  /**
   * Método para realiar la consulta de las opciones para realizar el rechazo.
   * 
   * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
   * @memberof InDevolutionService
   */
  getReasonsRejection(): Observable<Array<ListReasonRejectionResponseEntity>> {
    return new Observable(observer => {
      this.http.get(this.api.get('getreasonsrejection', [
        `?reversionRequestRejectionType=${Const.OrdersInDevolution}`
      ])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }

  /**
   * Método para realizar la aceptación o el rechazo de una devolución.
   *
   * @returns {Observable<[{}]>}
   * @memberof PendingDevolutionService
   */
  acceptOrDeniedDevolution(info: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.post(this.api.get('acceptOrDeniedDevolution'), info)
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }
}
