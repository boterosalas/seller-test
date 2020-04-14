import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortCollectionService {


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * funcion para obtener todos los puertos registrados
   *
   * @param {*} params
   * @returns
   * @memberof PortCollectionService
   */
  getAllPort(params: any) {
    return this.http.get(`${this.api.get('managePort')}/GetDispatchPortsAll`, { observe: 'response' });
  }
  /**
   * funcion para salvar un puerto registrado
   *
   * @param {*} params
   * @returns
   * @memberof PortCollectionService
   */
  savePort(params: any) {
    return this.http.post(`${this.api.get('managePort')}/RegisterDispatchPort`, params);
  }
  /**
   * funcion para actualizar un puerto seleccionado
   *
   * @param {*} params
   * @returns
   * @memberof PortCollectionService
   */
  upsertPort(params: any) {
    return this.http.patch(`${this.api.get('managePort')}/UpdateDispatchPort`, params, { observe: 'response' });
  }
  /**
   * funcion para filtrar un puerto por pais
   *
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof PortCollectionService
   */
  filterPortByCountryName(params: any): Observable<any> {
    return this.http.get(this.api.get('getPortsByCountryName', [params]), { observe: 'response' });
  }

}
