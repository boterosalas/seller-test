
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs/Observable';



@Injectable()
export class ListZonesService {


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  public getSpecifications(): Observable<{}> {
    return of(null);
    // this.http.get(this.api.get('zones'), { observe: 'response' });
  }

}
