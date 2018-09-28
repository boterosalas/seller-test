import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { TransportModel } from '../dialogs/models/transport.model';

const dialogTypeTransporter = 1;

@Injectable()
export class ListTransporterService {

  public transporters: Array<TransportModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.transporters = [
      new TransportModel( 'Envio Propio', 'Home delivery 1', 1, 1),
      new TransportModel( 'Envio Propio 2', 'Home delivery 2', 2, 2),
      new TransportModel( 'Envio Propio 3', 'Home delivery 3', 2, 3),
      new TransportModel( 'Envio Propio 4', 'Home delivery 4', 3, 4),
      new TransportModel( 'Envio Propio 5', 'Home delivery 5', 1, 5),
    ];
  }

  /**
   * Get const with a value of dialog type
   *
   * @returns {number}
   * @memberof ListTransporterService
   */
  getDialogType(): number {
    return dialogTypeTransporter;
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

  /**
   * Service to add transport, needs transport data to send to back.
   *
   * @param {TransportModel} transport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  createTransporter(transport: TransportModel): Observable<{}> {
    return new Observable(observer => {
      this.http.post<any>(this.api.get('addTransport'), transport, { observe: 'response' })
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
   * Service to update transport, need transport data to send to back.
   * Additional to data is required transport identifier to update.
   * @param {TransportModel} transport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  updateTransporter(transport: TransportModel): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('updateTransport'), transport, { observe: 'response' })
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
   * Service to delete transport, needs transport identifier to send to back.
   *
   * @param {number} idTransport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  deleteTransporter(idTransport: number): Observable<{}> {
    console.log('idTransport', idTransport);
    return new Observable(observer => {
      this.http.delete(this.api.get('deleteTransport', [idTransport])).subscribe((data: any) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
      });
    });
  }

  /**
   * Mock to get and object.
   *
   * @returns {Array<TransportModel>}
   * @memberof ListTransporterService
   */
  public getFakeListTransporter(): Array<TransportModel> {
    return this.transporters;
  }

  public getFakeTransporter(idToEdit: number) {
    return this.transporters[0];
  }

}
