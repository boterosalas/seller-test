import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { TransportModel } from '../dialogs/models/transport.model';
import { RequestOptions, Headers } from '@angular/http';

const dialogTypeTransporter = 1;

@Injectable()
export class ListTransporterService {

  public transporters: Array<TransportModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
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
   * Function to get all transports from service
   * @method getListTransporters
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  public getListTransporters(): Observable<{}> {
    return this.http.get(this.api.get('transports'), { observe: 'response' });
  }

  /**
   * Function to get a transport by identifier
   * @method getListTransporters
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  public getTransport(idTransport: number): Observable<{}> {
    return this.http.get(this.api.get('getTransport', [idTransport]), { observe: 'response' });
  }

  /**
   * Service to add transport, needs transport data to send to back.
   *
   * @param {TransportModel} transport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  createTransporter(transport: TransportModel): Observable<{}> {
    return this.http.patch<any>(this.api.get('transports'), [transport]);
  }

  /**
   * Service to update transport, need transport data to send to back.
   * Additional to data is required transport identifier to update.
   * @param {TransportModel} transport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  updateTransporter(transport: TransportModel): Observable<{}> {
    return this.http.post(this.api.get('transports'), [transport]);
  }

  /**
   * Service to delete transport, needs transport identifier to send to back.
   *
   * @param {number} idTransport
   * @returns {Observable<{}>}
   * @memberof ListTransporterService
   */
  deleteTransporter(idTransport: number): Observable<{}> {
    return this.http.delete<any>(this.api.get('getTransport', [idTransport]));
  }
}
