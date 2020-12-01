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


  getAllPaymentSummary(params: any): Observable<any> {
    return this.http.get(this.api.get('getListDispersionAll', [params]), { observe: 'response' });
  }
}
