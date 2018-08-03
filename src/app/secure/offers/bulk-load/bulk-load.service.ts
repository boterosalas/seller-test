import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '@app/shared';
import { endpoints, defaultVersion } from '../../../../../api-endpoints';

@Injectable()
export class BulkLoadService {
  httpOptions: any;

  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil) {
  }
  /**
  * Método para cerrar sesión
  * @returns {Observable<{}>}
  * @memberof BulkLoadService
  */
  setOffers(params: {}): Observable<{}> {
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
    const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['patchOffers'];
    return new Observable(observer => {
      this.http.patch<any>(endpoint, params, { observe: 'response', headers: headers })
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
