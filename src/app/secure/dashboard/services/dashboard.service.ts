// 3rd party components
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';

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

  public getRatingSellers(): Observable<any> {
    const pruebaRatingSellet = [
      {
        'IdSeller': 11618,
        'QualificationDate': '24/01/2020',
        'GeneratedDate': '24/01/2020',
        'UrlFile': null,
        'Qualitative': 'Excelente',
        'Quantitative': 5,
        'QualificationPromiseDelivery': {
          'Numerator': 10,
          'Denominator': 10,
          'Percentage': 200,
          'Qualification': 5,
          'QualificationPercentage': 0.5,
          'Total': 89.9,
          'PercentagePenalty': 200,
          'ValuePenalty': 2000000
        },
        'QualificationCase': {
          'Numerator': 10,
          'Denominator': 10,
          'Percentage': 200,
          'Qualification': 5,
          'QualificationPercentage': 0.5,
          'Total': 89.9,
          'PercentagePenalty': 200,
          'ValuePenalty': 2000000
        },
        'QualificationCanceled': {
          'Numerator': 10,
          'Denominator': 10,
          'Percentage': 200,
          'Qualification': 5,
          'QualificationPercentage': 0.5,
          'Total': 89.9,
          'PercentagePenalty': 200,
          'ValuePenalty': 2000000
        },
        'Detail':
        {
          'OrdersOutsideDeliveryDate': {
            'OrderNumber': '12345',
            'OrderDate': 'dd/mm/yyyy',
            'MaxDeliveryDate': 'dd/mm/yyyy',
            'DeliveryDate': 'dd/mm/yyyy',
            'DelayDays': 3,
            'CustomerIdentificationCard': '123454687',
            'CustomerName': 'Aristóbulo XD',
            'Penalty': 145612,
            'TotalCommission': 1456423
          },
          'OrdersCanceledBySellerResponsibility':
          {
            'OrderNumber': '12345',
            'OrderDate': 'dd/mm/yyyy',
            'OrderStatus': 'Entregado',
            'ReasonPqr': '',
            'PqrDate': 'dd/mm/yyyy',
            'CustomerIdentificationCard': '123454687',
            'CustomerName': 'Aristóbulo XD',
            'Penalty': 145612,
            'TotalCommission': 1456423
          },
          'OrdersWithPqr':
          {
            'OrderNumber': '12345',
            'OrderDate': 'dd/mm/yyyy',
            'MaxDeliveryDate': 'dd/mm/yyyy',
            'ReasonPqr': '',
            'PqrDate': 'dd/mm/yyyy',
            'CustomerIdentificationCard': '123454687',
            'CustomerName': 'Aristóbulo XD',
          }
        }
      }
    ];

    return of({
      status: 200,
      body: pruebaRatingSellet
    });
  }

}
