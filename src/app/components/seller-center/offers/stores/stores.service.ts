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

@Injectable()

/**
 * Clase StoresService
 */
export class StoresService extends BaseSellerService {

  /**
   * Método para realiar la consulta de las tiendas disponibles
   * @param {any} user
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getAllStores(user: User): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const enpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getAllSellers'];
      this.http.get(enpoint).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        this.hehs.error(error, () => {
          observer.error(error);
        });
      });
    });
  }


  /**
   * Servicio que permite obtener la lista de comisiones de acuerdo al seller
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getSellerCommissionCategory(user: User, store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const enpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'] + `/1`;
      // const enpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'] + `/${store.IdSeller}`;
      this.http.get(enpoint).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        this.hehs.error(error, () => {
          observer.error(error);
        });
      });
    });
  }

  /**
   * Servicio que permite obtener toda la lista de comisiones
   * @param {User} user
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getAllSellerCommissionCategory(user: User, store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      const enpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['getSellerCommissionCategory'];
      this.http.get(enpoint).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        this.hehs.error(error, () => {
          observer.error(error);
        });
      });
    });
  }
}

