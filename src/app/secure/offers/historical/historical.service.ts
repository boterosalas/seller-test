// 3rd party components
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// our own custom components
import { EndpointService } from '@app/core';
import { ModelFilter } from './components/filter/filter.model';

/**
 * @export
 * @class HistoricalService
 */
@Injectable()
export class HistoricalService {

  // Variable para almacenar los parametros que se le enviaran al servicio
  public paramsData: ModelFilter;

  /**
   * Create instances of HistoricalService
   * @param {http} HttpClient
   * @param {endpointService} EndpointService
   */
  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.paramsData = new ModelFilter();
  }

  /**
   * @method getHistoricalOffers
   * @description Metodo para obtener el histórico de ofertas
   * @returns {Observable<{}>}
   * @memberof HistoricalService
   */
  public getHistoricalOffers(params?: any): Observable<{}> {
    // Se crea variable que guardara los parametros unidos para enviarle al servicio
    let urlParams: any;

    this.paramsData.dateInitial = params === undefined || params.dateInitial === undefined || params.dateInitial === null || params.dateInitial === '' ? null : params.dateInitial;
    this.paramsData.dateFinal = params === undefined || params.dateFinal === undefined || params.dateFinal === null || params.dateFinal === '' ? null : params.dateFinal;
    this.paramsData.ean = params === undefined || params.ean === undefined || params.ean === null || params.ean === '' ? null : params.ean;
    this.paramsData.currentPage = params === undefined || params.currentPage === undefined || params.currentPage === null || params.currentPage === '' ? null : params.currentPage - 1;
    this.paramsData.limit = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;

    urlParams = '/' + this.paramsData.dateInitial + '/' + this.paramsData.dateFinal + '/' + this.paramsData.ean + '/' + this.paramsData.currentPage + '/' + this.paramsData.limit;

    console.log(this.api.get('getHistoricalOffers') + urlParams);

    return new Observable(observer => {
      this.http.get<any>(this.api.get('getHistoricalOffers', [urlParams]), { observe: 'response' })
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
   * TODO: Eliminar
   */
  public getHistoricalOffersFake(params?: any): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>('./assets/data.json') // TODO; Eliminar JSON File
        .subscribe(
          data => {
            setTimeout( () => {
              observer.next(data);
            }, 3000 );
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

  /**
   * TODO: Eliminar
   */
  public getHistoricalOffersFake2(params?: any): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>('./assets/data2.json') // TODO; Eliminar JSON File
        .subscribe(
          data => {
            setTimeout( () => {
              observer.next(data);
            }, 3000 );
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

}
