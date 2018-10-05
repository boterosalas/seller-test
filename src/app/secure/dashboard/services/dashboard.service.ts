// 3rd party components
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EndpointService } from '@app/core';

/**
 * @export
 * @class DashboardService
 */
@Injectable()
export class DashboardService {

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
  ) { }

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

}
