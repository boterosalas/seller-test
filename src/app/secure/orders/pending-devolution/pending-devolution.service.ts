import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Const, ListReasonRejectionResponseEntity } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class PendingDevolutionService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Método para realiar la consulta de las órdenes en estado pendiente.
   *
   * @param stringSearch
   * @returns Observable<[{}]>
   */
  getOrders(stringSearch: any): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('pendingDevolution', [stringSearch]))
        .subscribe((data: any) => {
          data = data ? data : [];
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
   * @memberof PendingDevolutionService
   */
  getReasonsRejection(): Observable<Array<ListReasonRejectionResponseEntity>> {
    return new Observable(observer => {
      this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrderPendingDevolution}`]),
      )
        .subscribe((data: any) => {
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
