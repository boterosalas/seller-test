import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DispersionService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }


 public getAllPaymentSummary(params: any): Observable<any> {
    return this.http.get(this.api.get('getListDispersionAll', [params]), { observe: 'response' });
  }

  public excludeSellerPayoneer(data: any): Observable<any> {
    return this.http.post(this.api.get('excludeSellerPayoneer'), data);
}
}
