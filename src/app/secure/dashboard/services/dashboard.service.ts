// 3rd party components
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';
import { ModelFilterSellerRating } from '../seller-rating/seller-rating.model';

/**
 * @export
 * @class DashboardService
 */
@Injectable()
export class DashboardService {

  public paramsData: ModelFilterSellerRating;

  /**
   * @description Create an instance of DashboardService
   * @param {_http} HttpClient
   * @param {_api} EndpointService
   * @memberof DashboardService
   */
  constructor(
    private _http: HttpClient,
    private _api: EndpointService,
    private datePipe: DatePipe,
  ) {
    this.paramsData = new ModelFilterSellerRating();
  }

  /**
   * @description Obtiene la sumatoria de todas las órdenes del cliente, separadas por estado.
   * @param idSeller La id del vendedor que se va a buscar.
   * @memberof DashboardService
   */
  public getOrdersByStatus(idSeller: string) {
    const URL = this._api.get('getOrdersStatus', [idSeller]);
    return this._http.get(URL);
  }

  /**
   * @description Obtiene la sumatoria del valor de las ventas de los últimos 3 meses.
   * @param idSeller La id del vendedor que se va a buscar.
   * @memberof DashboardService
   */
  public getLastSales(idSeller: string, date: string = new Date().toString() + '') {
    date = this.datePipe.transform(date, 'yyyy-MM-dd');
    const PARAMS = `${idSeller}/${date}`;
    const URL = this._api.get('getSellsSummary', [PARAMS]);
    return this._http.get(URL);
  }

  /**
   * Servicio para traer las calificaciones del vendedor
   * @param {string} idSeller Id del seller para traer las calificaciones
   * @param {string} [initialDate=new Date().toString() + ''] Para filtar por fecha inicial
   * @param {string} [finalDate=new Date().toString() + ''] Para filtrar por fecha final
   * @returns {Observable<any>}
   * @memberof DashboardService
   */
  public getRatingSellers(params: any): Observable<any> {
    this.paramsData.sellerId = params === undefined || params.sellerId === undefined || params.sellerId === null || params.sellerId === '' ? null : params.sellerId;
    this.paramsData.dateQualificationFinal = params === undefined || params.dateQualificationFinal === undefined || params.dateQualificationFinal === null || params.dateQualificationFinal === '' ? null : params.dateQualificationFinal;
    this.paramsData.datequalificationinitial = params === undefined || params.datequalificationinitial === undefined || params.datequalificationinitial === null || params.datequalificationinitial === '' ? null : params.datequalificationinitial;
    this.paramsData.generatedDateFinal = params === undefined || params.generatedDateFinal === undefined || params.generatedDateFinal === null;
    this.paramsData.generatedDateInitial = params === undefined || params.generatedDateInitial === undefined || params.generatedDateInitial === null;
    this.paramsData.paginationToken = params === undefined || params.paginationToken === undefined || params.paginationToken === null || params.paginationToken === '' ? null : params.paginationToken;
    this.paramsData.limit = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;

    const PARAMS = `${this.paramsData.sellerId}/${this.paramsData.datequalificationinitial}/${this.paramsData.dateQualificationFinal}/${null}/${null}/${this.paramsData.paginationToken}/${this.paramsData.limit}`;

    const URL = this._api.get('getSellerRating', [PARAMS]);
    return this._http.get(URL, { observe: 'response' });
  }

  public getSalesSummary(params: any): Observable<any> {
    return this._http.get(this._api.get('ordersSummaryStatus', [params]));
  }
  public getOrdensSummary(params: any): Observable<any> {
    return this._http.get(this._api.get('ordersSummaryStatus', [params]));
  }

  public getIndicators(): Observable<any> {
    return this._http.get(this._api.get('getIndicators'));
  }

}
