import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '../../../../../../service/cognito.service';
import { endpoints, defaultVersion } from '../../../../../../../../api-endpoints';


@Injectable()
export class StatesService {
  writerUrl = endpoints[defaultVersion.prefix + defaultVersion.number]['getStates'];
  httpOptions: any;

  constructor(private http: HttpClient,  public cognitoUtil: CognitoUtil) {
  }
  /**
  * Método para cerrar sesión
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
