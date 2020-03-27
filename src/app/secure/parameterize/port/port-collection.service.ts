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
    return this.http.get(`${this.api.get('managePort')}/GetDispatchPortsAll`, { observe: 'response' });
  }

  changeApplyCountry(params: any) {
    return new Observable(observer => {
      observer.next(!params);
    });
  }
  savePort(params: any) {
    return this.http.post(`${this.api.get('managePort')}/RegisterDispatchPort`, params);
  }
  upsertPort(params: any) {
    return this.http.patch(`${this.api.get('managePort')}/UpdateDispatchPort`, params, { observe: 'response' });
  }
  filterPortByCountryName(params: any): Observable<any> {
    return this.http.get(this.api.get('getPortsByCountryName', [params]), { observe: 'response' });
  }

}
