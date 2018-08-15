import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '@app/shared';
import { endpoints, defaultVersion } from '../../../../../api-endpoints';

@Injectable()
export class BulkLoadProductService {
  public httpOptions: any;
  public idToken: any;
  public headers: any;
  public currentDate: any;

  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil) {
    this.idToken = this.cognitoUtil.getTokenLocalStorage();
    this.headers = new HttpHeaders({ 'Authorization': this.idToken, 'Content-type': 'application/json; charset=utf-8' });
    this.currentDate = this.getDate();
  }

  /**
   * @method getDate()
   * @returns {*}
   * @description Metodo para obtener la fecha actual
   * @memberof BulkLoadProductService
   */
  private getDate(): any {
    let today: any = new Date();
    let dd: any = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
  }

  /**
  * Método para cerrar sesión
  * @returns {Observable<{}>}
  * @memberof BulkLoadProductService
  */
  setProducts(params: {}): Observable<{}> {
    const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['products'];
    return new Observable(observer => {
      this.http.patch<any>(endpoint, params, { observe: 'response', headers: this.headers })
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
   * @method getAmountAvailableLoads()
   * @returns {Observable}
   * @description Metodo para obtener el número de cargas que aun se pueden hacer
   * @memberof BulkLoadProductService
   */
  getAmountAvailableLoads(): Observable<{}> {
    let params = new HttpParams;
    params = params.append('date', this.currentDate);
    const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['products'];
    console.log(this.headers, params);
    return new Observable(observer => {
      this.http.get<any>(endpoint, { observe: 'response', headers: this.headers, params: params })
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
