import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { TransportModel } from '../dialogs/models/transport.model';

@Injectable()
export class ListTransporterService {

  public transporters: Array<TransportModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.transporters = [
      new TransportModel( 'Envio Propio', 'Home delivery 1', 1),
      new TransportModel( 'Envio Propio 2', 'Home delivery 2', 2),
      new TransportModel( 'Envio Propio 3', 'Home delivery 3', 3),
      new TransportModel( 'Envio Propio 4', 'Home delivery 4', 4),
      new TransportModel( 'Envio Propio 5', 'Home delivery 5', 5),
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

  public getFakeListTransporter(): Array<TransportModel> {
    return this.transporters;
  }

  public getFakeTransporter() {
    return this.transporters[0];
  }

}
