import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DetailPaymentService {
  public headers: any;


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * Servicio para obtener el historico de pagos
   * @param {*} paramsUrl
   * @param {*} paramsFilter
   * @returns {Observable<any>}
   * @memberof DetailPaymentService
   */
  public getAllDetailPayment(paramsUrl: any, paramsFilter): Observable<any> {
    return this.http.post(this.api.get('getListHistoricPayments', [paramsUrl]), paramsFilter , { observe: 'response' });
  }

  /**
   * Servicio para obtener las novedades de pagos
   * @param {*} paramsUrl
   * @param {*} paramsFilter
   * @returns {Observable<any>}
   * @memberof DetailPaymentService
   */
  public getAllNewsCollected(paramsUrl: any, paramsFilter): Observable<any> {
    return this.http.post(this.api.get('getListNewsCollected', [paramsUrl]), paramsFilter, { observe: 'response' });
  }

  /**
   * Servicio descargable detalle de dispersion
   * @param {*} email
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof DetailPaymentService
   */
  public downloadDetailPayment(email: any, params: any): Observable<any> {
    return this.http.post(this.api.get('exporDetailPayment', [email]), params , { observe: 'response' });
  }
}
