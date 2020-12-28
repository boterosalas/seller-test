import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DispersionService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

/**
 * funcion para consumir endPoint para consultar todos los vendedores a pagar por dispersion
 *
 * @param {*} params
 * @returns {Observable<any>}
 * @memberof DispersionService
 */
public getAllPaymentSummary(params: any): Observable<any> {
    return this.http.get(this.api.get('getListDispersionAll', [params]), { observe: 'response' });
  }
/**
 * funcion para excluir - incluir vendedores para el pago por dispersion
 *
 * @param {*} data
 * @returns {Observable<any>}
 * @memberof DispersionService
 */
public excludeSellerPayoneer(data: any): Observable<any> {
    return this.http.post(this.api.get('excludeSellerPayoneer'), data);
  }
/**
 * funcion para enviar la dispersion 
 *
 * @param {*} data
 * @returns {Observable<any>}
 * @memberof DispersionService
 */
public sendDispersion(data: any): Observable<any> {
    return this.http.post(this.api.get('sendDispersion'), data);
  }

/**
 * funcion para consultar el estado de la carga de dispersion en el back
 *
 * @param {*} params
 * @returns {Observable<any>}
 * @memberof DispersionService
 */
public statusLoadDispersion(): Observable<any> {
    return this.http.get(this.api.get('statusLoadDispersion'), { observe: 'response' });
  }
}
