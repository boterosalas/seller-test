import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class BulkLoadService {
  httpOptions: any;

  constructor(
    private http: HttpClient,
    private api: EndpointService,
    public cognitoUtil: CognitoUtil
  ) {
  }

  /**
   * Método para cerrar sesión.
   *
   * @returns {Observable<{}>}
   * @memberof BulkLoadService
   */
  setOffers(params: {}): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('patchOffers'), params, { observe: 'response' })
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
