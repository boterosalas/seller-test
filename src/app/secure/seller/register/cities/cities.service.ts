import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '@app/shared';
import { endpoints, defaultVersion } from '../../../../../../api-endpoints';
@Injectable()
export class CitiesServices {

  writerUrl = endpoints[defaultVersion.prefix + defaultVersion.number]['getCities'];
  httpOptions: any;

  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil
  ) {
  }

  /**
  * Método para consumir el servicio de ciudades
  * @returns {Observable<{}>}
  * @memberof CitiesServices
  */
  fetchData(paramValue: {}): Observable<{}> {
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
    const url = this.writerUrl + paramValue;
    return new Observable(observer => {
      this.http.get<any>(url, { observe: 'response', headers: headers })
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
