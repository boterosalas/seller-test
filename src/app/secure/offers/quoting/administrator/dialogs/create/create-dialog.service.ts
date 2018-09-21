import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Billing } from '@app/shared';
import { Observable } from 'rxjs';
import { TypeTransportModel } from '../models/transports-type.model';

@Injectable()
export class CreateDialogService {

  /**
   * JSON mock to emulate send methods data. TODO: Delete
   */
  sendMethodData: Array<TypeTransportModel>;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    /** TODO: Delete */
    this.sendMethodData = [
      new TypeTransportModel('name 1', 1),
      new TypeTransportModel('name 2', 2),
      new TypeTransportModel('name 3', 3),
    ];
  }

  /** @method getSendMethods
   * @description Método para obtener el listado de metodos de envio
   * @returns {Observable<{}>}
   * @memberof CreateDialogService
   */
  getSendMethods(): Observable<{}> {
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
    return this.sendMethodData;
  }
}


