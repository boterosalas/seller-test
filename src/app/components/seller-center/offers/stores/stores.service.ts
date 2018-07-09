/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';


/* our own custom components */
import { BaseSellerService } from '../../../shared/services/base-seller.service';
import { endpoints, defaultVersion } from '../../../../../../api-endpoints';
import { User } from '../../../shared/models/login.model';
import { StoreModel } from './models/store.model';
import { CognitoUtil } from '../../../aws-cognito/service/cognito.service';

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
  constructor(private http: HttpClient,  public cognitoUtil: CognitoUtil) {
  }
  /**
   * Método para realiar la consulta de las tiendas disponibles
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllStores(user: User): Observable<[{}]> {

    return new Observable(observer => {
      // capturo el token de usuario para el envio en headers
      const idToken =  this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getAllSellers'];
      // llamado al servicio para traer todos los vendedores
        this.http.get (endpoint, { observe: 'response', headers: headers })
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
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getSellerCommissionCategory(user:User, store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'] + `/${store.IdSeller}`;
      // capturo el token de usuario para el envio en headers
      const idToken =  this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});

      this.http.get(endpoint, {observe: 'response', headers: headers })
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
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
  public getAllSellerCommissionCategory(user:User, store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      // capturo el token de usuario para el envio en headers
      const idToken =  this.cognitoUtil.getTokenLocalStorage();
      // construyo eñ header para enviar al servicio
      const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'];
      this.http.get(endpoint, {observe: 'response', headers: headers})
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
            observer.next(error);
          }
        );
    });
  }
}

