import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService, CognitoUtil } from '@app/core';

@Injectable()
export class QuotingService {


  constructor(
    private http: HttpClient,
    private api: EndpointService,
    public cognitoUtil: CognitoUtil
  ) {
  }




  /**
   * Servicio para consultar las lista de parametrizaciones creadas
   * @returns {Observable<any>}
   * @memberof QuotingService
   */
  public getQuotingSeller(): Observable<any> {
    return this.http.get(this.api.get('getQuoting'), { observe: 'response' });

  }

  /**
   * Servicio para crear la parametrizacion del cotiz<ador.
   * @param {*} param
   * @returns {Observable<any>}
   * @memberof QuotingService
   */
  public crateQuotingSeller(param: any): Observable<any> {
    return this.http.post(this.api.get('createQuoting', [param]), { observe: 'response' });
  }

  /**
   * Servicio para actualizar las parametrizaciones de cotizador
   * @param {*} param
   * @returns {Observable<any>}
   * @memberof QuotingService
   */
  public updateQuotingSeller(param: any): Observable<any> {
    return this.http.patch(this.api.get('updateQuoting', [param]), { observe: 'response' });
  }

  /**
   * Servicio para eliminar las parametrizaciones de cotizador creadas
   * @param {*} param Id de la parametrizacion
   * @returns {Observable<any>}
   * @memberof QuotingService
   */
  public deleteQuotingSeller(param: any): Observable<any> {
    return this.http.delete(this.api.get('deleteQuoting', [param]), { observe: 'response' });

  }
}
