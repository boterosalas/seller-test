/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


/* our own custom components */
import { StoreModel } from './models/store.model';
import { CognitoUtil } from '@app/shared';
import { endpoints, defaultVersion } from '../../../../../api-endpoints';

@Injectable()

/**
 * Clase StoresService
 */
export class StoresService {
  /**
   * Método constructor de la clase StoresService
   * @param http objeto de la clase HttpClient para consumo de servicio
   * @param cognitoUtil
   */
  constructor(private http: HttpClient, public cognitoUtil: CognitoUtil) {
  }
  /**
   * Método para realiar la consulta de las tiendas disponibles
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllStores(user: any): Observable<[{}]> {

    return new Observable(observer => {
      // capturo el token de usuario para el envio en headers
      const idToken = this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getAllSellers'];
      // llamado al servicio para traer todos los vendedores
      this.http.get(endpoint, { observe: 'response', headers: headers })
        .subscribe(
          (data: any) => {
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }


  /**
   * Servicio que permite obtener la lista de comisiones de acuerdo al seller
   * Este servicio trae el arbol más pequeño.
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getSellerCommissionCategory(store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'] + `/${store.IdSeller}`;
      // capturo el token de usuario para el envio en headers
      const idToken = this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

      this.http.get(endpoint, { observe: 'response', headers: headers })
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
          observer.next(error);
        }
        );
    });
  }

  /**
   * Servicio que permite obtener la lista de comisiones de acuerdo al seller
   * Este servicio trae el arbol más pequeño.
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public patchSellerCommissionCategory(params: {}): Observable<{}> {
    // obtengo el endpoint desde el archivo de configuración de endpoints
    const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'];
    // capturo el token de usuario para el envio en headers
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    // construyo eñ header para enviar al servicio
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
    return new Observable(observer => {
      this.http.patch<any>(endpoint, params, { observe: 'response', headers: headers })
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
   * Servicio que permite obtener toda la lista de comisiones
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllSellerCommissionCategory(): Observable<[{}]> {

    return new Observable(observer => {
      // capturo el token de usuario para el envio en headers
      const idToken = this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'];
      this.http.get(endpoint, { observe: 'response', headers: headers })
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
          observer.next(error);
        }
        );
    });
  }
}
