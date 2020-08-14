import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class BulkLoadBillingService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  public sendBulkLoadBilling(body: any): Observable<{}> {
    return this.http.patch(this.api.get('setMassiveBillOrderAsync'), body);
  }
}
