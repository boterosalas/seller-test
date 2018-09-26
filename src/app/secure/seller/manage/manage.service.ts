import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { Logger } from '@core/util/logger.service';

const log = new Logger('ManageSellerService');

@Injectable()
export class ManageSellerService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   *
   *
   * @param {*} param
   * @returns {Observable<{}>}
   * @memberof ManageSellerService
   */
  getListSellersName(param: any): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getListSellersName', [param]), { observe: 'response' })
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
   *
   *
   * @param {string} idSeller
   * @param {string} allSeller
   * @returns {Observable<{}>}
   * @memberof ManageSellerService
   */
  getSpecificSeller(idSeller: string, allSeller: string): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getSpecificSeller', [idSeller, allSeller]), { observe: 'response' })
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
   *
   *
   * @param {*} params
   * @returns {Observable<{}>}
   * @memberof ManageSellerService
   */
  updateSeller(params: any): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('updateSeller'), params, { observe: 'response' })
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
