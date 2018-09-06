import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';


@Injectable()
export class CitiesServices {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * @method fetchData
   * @description Método para consumir el servicio de ciudades
   * @returns {Observable<{}>}
   * @memberof CitiesServices
   */
  fetchData(paramValue: {}): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getCities', [paramValue]), { observe: 'response' })
        .subscribe(
          data => {
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }
}
