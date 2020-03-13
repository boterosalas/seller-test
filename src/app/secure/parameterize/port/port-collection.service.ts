import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortCollectionService {

 data = [
   {
     id : 1,
     name : 'puerto_1',
     country : 'ESTADOS UNIDOS',
     address : 'direccion 2',
     phone: 3053659647,
     tariff: 0,
     shippingCost: 0,
     negotiatedShippingCostPercent: 0,
     apply: true,
     countrys : ['ESTADOS UNIDOS', 'ARGENTINA', 'MEXICO', 'FRANCIA', 'BRASIL', 'VENEZUELA', 'COLOMBIA', 'PERU']
   }
  ];

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }


  getAllPort(params: any) {
    return new Observable(observer => {
      observer.next(this.data);
    });
  }

  changeApplyCountry(params: any) {
    return new Observable(observer => {
      observer.next(!params);
    });
  }
  savePort(params: any) {
    return new Observable(observer => {
      observer.next(true);
    });
  }
}
