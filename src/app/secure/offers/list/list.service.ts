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

    this.paramsData.ean = params === undefined || params.ean === undefined ? null : params.ean;
    this.paramsData.product = params === undefined || params.product === undefined ? null : params.product.replace(/\ /g, '+');
    this.paramsData.stock = params === undefined || params.stock === undefined ? null : params.stock;
    this.paramsData.currentPage = params === undefined || params.currentPage === undefined ? null : params.currentPage - 1;
    this.paramsData.limit = params === undefined || params.limit === undefined ? null : params.limit;

    urlParams = this.paramsData.ean + '/' + this.paramsData.product + '/' + this.paramsData.stock + '/' + this.paramsData.currentPage + '/' + this.paramsData.limit;

    return new Observable(observer => {
      this.http.get<any>(this.api.get('getOffers', [urlParams]))
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
