import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportCommissionService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  public sendReportCommission(body: any): Observable<any> {
    console.log(body);
    return this.http.post(this.api.get('exportCommission'), body);
  }
  public getListCommissionAll(body: any): Observable<any> {
    console.log(body);
    return this.http.post(this.api.get('getListCommissionAll'), body);
  }
}
