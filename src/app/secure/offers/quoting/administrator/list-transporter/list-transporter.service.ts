import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ListTransporterService {

  public transporters: Array<any>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.transporters = [
      {
        idTransporter: 0,
        nameTransporter: 'Envio Propio',
        typeTransporter: 'Home delivery'
      },
      {
        idTransporter: 1,
        nameTransporter: 'Envio Propio 1',
        typeTransporter: 'Home delivery 1'
      },
      {
        idTransporter: 2,
        nameTransporter: 'Envio Propio 2',
        typeTransporter: 'Home delivery 2'
      },
      {
        idTransporter: 3,
        nameTransporter: 'Envio Propio 3',
        typeTransporter: 'Home delivery 3'
      },
      {
        idTransporter: 4,
        nameTransporter: 'Envio Propio 4',
        typeTransporter: 'Home delivery 4'
      }
    ];
  }

  /**
   * @method getListTransporters
   * @description Método para obtener el listado de departamentos
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  getListTransporters(): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getTransporters'), { observe: 'response' })
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

  getFakeListTransporter() {
    return this.transporters;
  }

}
