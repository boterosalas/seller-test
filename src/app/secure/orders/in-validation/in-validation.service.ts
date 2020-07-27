import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class InValidationService {

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
          data = data ? data : [];
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

  /**
   * Método para realizar la aceptación de una devolución.
   * 
   * @returns {Observable<[{}]>}
   * @memberof PendingDevolutionService
   */
  acceptDevolution(): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('acceptDevolution'))
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

  /**
   * Método para realizar el rechazo de una devolución.
   * 
   * @returns {Observable<[{}]>}
   * @memberof PendingDevolutionService
   */
  reportNovelty(): Observable<[{}]> {
    return new Observable(observer => {
      this.http.get(this.api.get('reportNovelty'))
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
 * @memberof InValidationService
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
