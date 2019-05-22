import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable } from 'rxjs';


const responseStatus = {
  status: 200,
  body: {
    statusCode: 200,
    body: JSON.stringify({
      Data: {
        Status: 3,
        Data: [
          {EAN: '1987081822179', NAME: null},
          {EAN: '6581480417371', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: null},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
          {EAN: '571825208827', NAME: 'PRUEBA3'},
        ]
      }
    })
  }
};

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

  verifyStatusBulkLoad(): Observable<any> {
    return new Observable(observer => {
            observer.next(responseStatus);
    });
  }
}
