import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { ZoneModel } from '../dialogs/models/zone.model';


const dialogTypeZone = 2;

@Injectable()
export class ListZonesService {

  public zones: Array<any>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.zones = [
      {
        id: 5,
        nameZone: 'Envio Propio'
      },
      {
        id: 1,
        nameZone: 'Envio Propio 1'
      },
      {
        id: 2,
        nameZone: 'Envio Propio 2'
      },
      {
        id: 3,
        nameZone: 'Envio Propio 3'
      },
      {
        id: 4,
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

  /**
   * Get const with a value of dialog type
   *
   * @returns {number}
   * @memberof ListTransporterService
   */
  getDialogType(): number {
    return dialogTypeZone;
  }

  getFakeListZones() {
    return this.zones;
  }

  createZone(transport: ZoneModel): Observable<{}> {
    return new Observable(observer => {
      this.http.post<any>(this.api.get('addZone'), transport, { observe: 'response' })
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
