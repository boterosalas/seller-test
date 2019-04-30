import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryTreeService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  getCategoryTree(): Observable<any> {
    return this.http.get(this.api.get('getSellerCommissionCategory'), {observe: 'response'});
  }
}
