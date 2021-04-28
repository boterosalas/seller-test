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
  // getOrders(stringSearch: any): Observable<[{}]> {
  //   return new Observable(observer => {
  //     this.http.get(this.api.get('pendingDevolution', [stringSearch]))
  //       .subscribe((data: any) => {
  //         data = data ? data : [];
  //         observer.next(data);
  //       }, err => {
  //         observer.error(err);
  //       });
  //   });
  // }

  getOrders(params: any): Observable<[{}]> {
    let filter = params.limit + `&reversionRequestStatusId=${params.reversionRequestStatusId}` ;
    if (params) {
      if ( params.dateOrderInitial && params.dateOrderInitial !== '') {
        filter += `&dateOrderInitial=${params.dateOrderInitial}`;
      }
      if (params.dateOrderFinal && params.dateOrderFinal !== '') {
        filter += `&dateOrderFinal=${params.dateOrderFinal}`;
      }
      if (params.orderNumber && params.orderNumber !== '') {
        filter += `&orderNumber=${params.orderNumber}`;
      }
      if (params.identificationCard && params.identificationCard !== '') {
        filter += `&identificationCard=${params.identificationCard}`;
      }
      if (params.idSeller && params.idSeller !== '') {
        filter += `&idSeller=${params.idSeller}`;
      }

    }
    return new Observable(observer => {
      this.http.get(this.api.get('pendingDevolution', [filter])).subscribe((data: any) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
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
/**
 * funcion para consultar los comentarios devoluciones
 *
 * @param {*} params
 * @returns {Observable<any>}
 * @memberof PendingDevolutionService
 */
getAllCommentRefuse(params: any): Observable<any> {
    return new Observable(observer => {
      this.http.post(this.api.get('getAllCommentRefuse'), params)
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }
}
