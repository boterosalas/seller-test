import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DetailPaymentService {
  public headers: any;


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  public getAllDetailPayment(paramsUrl: any, paramsFilter): Observable<any> {
    return this.http.post(this.api.get('getListHistoricPayments', [paramsUrl]), paramsFilter , { observe: 'response' });
  }

  public getAllNewsCollected(paramsUrl: any, paramsFilter): Observable<any> {
    return this.http.post(this.api.get('getListNewsCollected', [paramsUrl]), paramsFilter, { observe: 'response' });
  }
}
