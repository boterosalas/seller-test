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
    this.shippingMethods = [
        new ShippingMethodsModel ('Por Categoria', 'library_books', 0),
        new ShippingMethodsModel ('Rango de precio', 'local_offer', 0),
        new ShippingMethodsModel ('Rango de peso', 'assignment', 0),
    ];
  }

  getFakeListShipingMethods() {
    return this.shippingMethods;
  }

  public getShippingMethods():  Observable<Array<ShippingMethodsModel>> {
    return new Observable(observer => {
      this.http.get(this.api.get('getSendMethod'))
        .subscribe((data: any) => {
          observer.next(data);
          console.log(data);
        }, err => {
          observer.error(err);
          console.log(err);
        });
    });
  }
}
