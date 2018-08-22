import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil } from '@app/core';
import { defaultVersion, endpoints } from '@root/api-endpoints';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class StatesService {
  writerUrl = endpoints[defaultVersion.prefix + defaultVersion.number]['getStates'];
  httpOptions: any;

  constructor(private http: HttpClient,  public cognitoUtil: CognitoUtil) {
  }
  /**
  * @method fetchData
  * @description Metodo para obtener el listado de departamentos
  * @returns {Observable<{}>}
  * @memberof StatesService
  */
  public fetchData(): Observable<{}> {
    const idToken =  this.cognitoUtil.getTokenLocalStorage();

    const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});

    return new Observable(observer => {
      this.http.get<any>(this.writerUrl, { observe: 'response', headers: headers })
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
