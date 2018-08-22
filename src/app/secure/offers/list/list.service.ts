import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil } from '@app/core';
import { defaultVersion, endpoints } from '@root/api-endpoints';
import { Observable } from 'rxjs';

import { ModelFilter } from './components/filter/filter.model';

/**
 *
 * @export
 * @class ListService
 */
@Injectable()
export class ListService {

  /*Variable para almacenar el endpoint que se va a consumir*/
  public endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getOffers'];

  /*Variable para almacenar los parametros que se le enviaran al servicio*/
  public paramsData: ModelFilter;

  /**
   * Create instances of ListService
   * @param {http} HttpClient
   * @param {cognitoUtil} CognitoUtil
   */
  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil
  ) {
    this.paramsData = new ModelFilter();
  }

  /**
  * @method getOffers
  * @description Metodo para obtener el listado de ofertas
  * @returns {Observable<{}>}
  * @memberof ListService
  */
  public getOffers(params?: any): Observable<{}> {
    /*Se crea variable que guardara los parametros unidos para enviarle al servicio*/
    let urlParams: any;

    this.paramsData.ean = params === undefined || params.ean === undefined ? null : params.ean;
    this.paramsData.product = params === undefined || params.product === undefined ? null : params.product.replace(/\ /g, '+');
    this.paramsData.stock = params === undefined || params.stock === undefined ? null : params.stock;
    this.paramsData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage - 1;
    this.paramsData.limit = params === undefined || params.limit === undefined ? null : params.limit;

    urlParams = '/' + this.paramsData.ean + '/' + this.paramsData.product + '/' + this.paramsData.stock + '/' + this.paramsData.currentPage + '/' + this.paramsData.limit;

    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

    return new Observable(observer => {
      this.http.get<any>(this.endpoint + urlParams, { observe: 'response', headers: headers })
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

}
