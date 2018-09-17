import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListZonesService {

  public zones: Array<any>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.zones = [
      {
        idZone: 0,
        nameZone: 'Envio Propio'
      },
      {
        idZone: 1,
        nameZone: 'Envio Propio 1'
      },
      {
        idZone: 2,
        nameZone: 'Envio Propio 2'
      },
      {
        idZone: 3,
        nameZone: 'Envio Propio 3'
      },
      {
        idZone: 4,
        nameZone: 'Envio Propio 4'
      }
    ];
  }

  /**
   * @method getListZones
   * @description Método para obtener el listado de departamentos
   * @returns {Observable<{}>}
   * @memberof ListZonesService
   */
  getListZones(): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getZones'), { observe: 'response' })
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

  getFakeListZones() {
    return this.zones;
  }

}
