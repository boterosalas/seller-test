import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraudNotificationService {

  constructor(
    private http: HttpClient,
    private api: EndpointService,
) { }


    /**
   * Método para realiar la consulta de los fraudes
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
        if (params.fileName && params.fileName !== '') {
          filter += `&fileName=${params.fileName}`;
        }
      }
  
      return new Observable(observer => {
        this.http.get<any[]>(this.api.get('getFrauds', [params.limit + filter ])).subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
      });
    }

    /**
     * funcion para guardar el listado de fraudes
     *
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof FraudNotificationService
     */
     public registersFrauds(data: any): Observable<any> {
      return this.http.post(this.api.get('sendFrauds'), data);
  }

    /**
     * funcion para obtener el template
     *
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof FraudNotificationService
     */
     public getFraudTemplate(): Observable<any> {
      return this.http.get(this.api.get('downloadTemplateFrauds'));
  }

      /**
     * Metodo para consultar el estado de los fraudes
     * @returns
     * @memberof FraudNotificationService
     */
       public getStatusFrauds() {
        return this.http.get(this.api.get('statusFrauds'), { observe: 'response' });
    }


}