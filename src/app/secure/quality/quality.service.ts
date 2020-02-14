import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { Order } from '@app/shared';

@Injectable()
export class CalificationService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {}

  getOrderList(params: any): Observable<[{}]> {
    let filter = '';
    if (params) {
      if ( params.dateOrderInitial && params.dateOrderInitial !== '') {
        filter += `&dateOrderInitial=${params.dateOrderInitial}`;
      }
      if (params.dateOrderFinal && params.dateOrderFinal !== '') {
        filter += `&dateOrderFinal=${params.dateOrderFinal}`;
      }
      if (params.idChannel && params.idChannel !== '') {
        filter += `&idChannel=${params.idChannel}`;
      }

      if (params.orderNumber && params.orderNumber !== '') {
        filter += `&orderNumber=${params.orderNumber}`;
      }
      if (params.identificationCard && params.identificationCard !== '') {
        filter += `&identificationCard=${params.identificationCard}`;
      }
      if (params.processedOrder && params.processedOrder !== '') {
        filter += `&processedOrder=${params.processedOrder}`;
      }
    }
    return new Observable(observer => {
      this.http.get<Order[]>(this.api.get('searchOrders', [params.idSeller, params.limit + `&idStatusOrder=${params.state}` + filter ])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }

  public getListCalificationsBySeller(params: any): Observable<any> {
    return this.http.get(this.api.get('getSellerRating', [params]));
  }

 public delete(body: any): Observable<{}> {
    return this.http.patch(this.api.get('upsertQualification'), body);
  }

  public notificate(body: any): Observable<any> {
    return this.http.post(this.api.get('upsertQualification'), body);
  }
}
