import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class StatesService {

  constructor(private http: HttpClient, private api: EndpointService) {
  }

  /**
   * @method fetchData
   * @description Método para obtener el listado de departamentos
   * @returns {Observable<{}>}
   * @memberof StatesService
   */
  public fetchData(): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getStates'), { observe: 'response' })
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
