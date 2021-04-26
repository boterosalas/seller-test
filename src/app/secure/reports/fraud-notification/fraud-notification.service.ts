import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { FraudEntity } from '@app/shared';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraudNotificationService {

  constructor(
    private http: HttpClient,
    private api: EndpointService,
) { }


  public getFraudList(
    stringSearch: string
  ): Observable<FraudEntity[]> {
    return new Observable(observer => {
      this.http
        .get<FraudEntity[]>(this.api.get('getFrauds', [stringSearch]))
        .subscribe(
          (data) => {
            // Validación debido a que a veces el endpoint solo responde un status 200.
            data = !data ? [] : data;
            if (data) {
              observer.next(data);
            }
          },
          err => observer.error(err)
        );
    });
  }

    /**
     * funcion para guardar el listado de fraudes
     *
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof FraudNotificationService
     */
     public registersFrauds(data: any): Observable<any> {
      return this.http.post(this.api.get('sendFrauds'), data);
  }

    /**
     * funcion para obtener el template
     *
     * @param {*} data
     * @returns {Observable<any>}
     * @memberof FraudNotificationService
     */
     public getFraudTemplate(): Observable<any> {
      return this.http.get(this.api.get('downloadTemplateFrauds'));
  }

      /**
     * Metodo para consultar el estado de la carga masiva
     * @returns
     * @memberof FraudNotificationService
     */
       public getStatusFrauds() {
        return this.http.get(this.api.get('statusFrauds'), { observe: 'response' });
    }


}


