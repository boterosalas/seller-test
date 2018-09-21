import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { ShippingMethodsModel } from '@app/secure/offers/quoting/administrator/shipping-methods/shipping-methods.model';

@Injectable()
export class ShippingMethodsService {

  public shipingMethods: Array<ShippingMethodsModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.shipingMethods = [
        new ShippingMethodsModel ('Por Categoria', 'library_books', 0),
        new ShippingMethodsModel ('Rango de precio', 'local_offer', 0),
        new ShippingMethodsModel ('Rango de peso', 'assignment', 0),
    ];
  }

  getFakeListShipingMethods() {
    return this.shipingMethods;
  }

}
