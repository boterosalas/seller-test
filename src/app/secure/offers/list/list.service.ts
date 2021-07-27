import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

import { ModelFilter } from './components/filter/filter.model';


@Injectable()
export class ListService {

  // Variable para almacenar los parámetros que se le enviaran al servicio
  public paramsData: ModelFilter;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.paramsData = new ModelFilter();
  }


  public getOffers(params?: any): Observable<{}> {
    // Se crea variable que guardara los parámetros unidos para enviarle al servicio.
    let urlParams: any;

    this.paramsData.ean = params === undefined || params.ean === undefined || params.ean === null || params.ean === '' ? null : params.ean;
    this.paramsData.product = params === undefined || params.product === undefined || params.product === null || params.product === '' ? null : params.product.replace(/\ /g, '+');
    this.paramsData.stock = params === undefined || params.stock === undefined || params.stock === null || params.stock === '' ? null : params.stock;
    this.paramsData.currentPage = params === undefined || params.currentPage === undefined || params.currentPage === null || params.currentPage === '' ? null : params.currentPage - 1;
    this.paramsData.limit = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;
    this.paramsData.pluVtex = params === undefined || params.pluVtex === undefined || params.pluVtex === null || params.pluVtex === '' ? null : params.pluVtex;
    this.paramsData.sellerSku = params === undefined || params.sellerSku === undefined || params.sellerSku === null || params.sellerSku === '' ? null : params.sellerSku;
    this.paramsData.reference = params === undefined || params.reference === undefined || params.reference === null || params.reference === '' ? null : params.reference;

    urlParams = this.paramsData.ean + '/' + this.paramsData.product + '/' + this.paramsData.stock + '/' + this.paramsData.currentPage + '/' + this.paramsData.limit + '/' + this.paramsData.pluVtex + '/' + this.paramsData.sellerSku + '/' + this.paramsData.reference;

    return new Observable(observer => {
      this.http.get<any>(this.api.get('getOffers', [urlParams]), { observe: 'response' })
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

  /**
   * Servicio patch desactivar masiva de ofertas
   * @param {{}} body
   * @returns {Observable<{}>}
   * @memberof ListService
   */
  desactiveMassiveOffers(body: {}): Observable<{}> {
    return this.http.patch(this.api.get('patchDesactiveOffer'), body, { observe: 'response' });
  }

/**
 * funcion para programar ofertas
 *
 * @param {*} body
 * @returns {Observable<any>}
 * @memberof ListService
 */
public scheduleoffer(body: any): Observable<any> {
    return this.http.post(this.api.get('scheduleoffer'), body, { observe: 'response' });
  }
/**
 * funcion para editar una oferta programada
 *
 * @param {*} body
 * @returns {Observable<any>}
 * @memberof ListService
 */
public editScheduleoffer(body: any): Observable<any> {
    return this.http.patch(this.api.get('scheduleoffer'), body, { observe: 'response' });
  }
/**
 * funcion para borrar una oferta programada
 *
 * @param {*} param
 * @returns {Observable<any>}
 * @memberof ListService
 */
public deleteScheduleoffer(param: any): Observable<any> {
    return this.http.delete(this.api.get('deleteScheduleoffer', [param]), { observe: 'response' });
  }
}
