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
  setOffers(body: any): Observable<{}> {
    return this.http.patch(this.api.get('patchOffers'), body);
  }

  setOffersProducts(body: {}): Observable<{}> {
    return this.http.patch(this.api.get('patchOffersProducts'), body, { observe: 'response' });
  }

  public verifyStatusBulkLoad(): Observable<any> {
    return this.http.get(this.api.get('getStatusOffers'), { observe: 'response' });
  }
}
