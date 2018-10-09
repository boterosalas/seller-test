import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { ShippingMethodsModel } from './shipping-methods.model';

@Injectable()
export class ShippingMethodsService {

  public shippingMethods: Array<ShippingMethodsModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  public getShippingMethods():  Observable<any> {
    return new Observable(observer => {
      this.http.get(this.api.get('getSendMethod'))
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }
}
