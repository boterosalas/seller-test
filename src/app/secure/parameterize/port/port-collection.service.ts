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
     port : 'puerto_01',
     country : 'Argentina',
     collection_center : 'usa',
     address : 'direccion 2',
     apply: false
   }
   , {
     port : 'puerto_02',
     country : 'Mexico',
     collection_center : 'mexico',
     address : 'direccion 2',
     apply: false
   }
   , {
     port : 'puerto_03',
     country : 'pais10',
     collection_center : 'atlantis',
     address : 'direccion 1',
     apply: true
   }
   , {
     port : 'puerto_04',
     country : 'Belgica',
     collection_center : 'belgica',
     address : 'direccion 3',
     apply: false
   }
   , {
     port : 'puerto_05',
     country : 'china',
     collection_center : 'china',
     address : 'direccion 5',
     apply: false
   }
   , {
     port : 'puerto_06',
     country : 'Ecuador',
     collection_center : 'Ecuador',
     address : 'direccion 9',
     apply: false
   }
   , {
     port : 'puerto_07',
     country : 'USA',
     collection_center : 'Canada',
     address : 'direccion 10',
     apply: false
   }
  ];

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }


  getAllPort() {
    return new Observable(observer => {
      observer.next(this.data);
    });
  }
}
