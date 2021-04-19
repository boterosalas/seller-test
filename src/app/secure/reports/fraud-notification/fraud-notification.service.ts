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
   * Servicio para obtener los fraudes
   * @param {*} paramsUrl
   * @param {*} paramsFilter
   * @returns {Observable<any>}
   * @memberof DetailPaymentService
   */
  public getFraudList(paramsUrl: any, paramsFilter): Observable<any> {
    return this.http.get(this.api.get('getFrauds', [paramsUrl]), paramsFilter);
  }
}
