import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';

import { StoreModel } from './models/store.model';


@Injectable()
export class StoresService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * Método para realiar la consulta de las tiendas disponibles.
   *
   * @param {any} user
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllStoresFull(user: any): Observable<[{}]> {
    return new Observable(observer => {
      // llamado al servicio para traer todos los vendedores
      this.http.get(this.api.get('getAllSellersFull'), { observe: 'response' })
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
   * Método para realiar la consulta de las tiendas disponibles.
   *
   * @param {any} user
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllStores(user: any): Observable<[{}]> {
    return new Observable(observer => {
      // llamado al servicio para traer todos los vendedores
      this.http.get(this.api.get('getAllSellers'), { observe: 'response' })
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

  public changeStateSeller(body: any): Observable<any> {
    console.log(55, body, this.api.get('changeStatusSeller'));
    return new Observable(observer => {
      this.http.patch(this.api.get('changeStatusSeller'), body, { observe: 'response' }).subscribe((data) => {
        console.log(44,data);
        observer.next(data);
      }, error => {
        observer.next(error);
      })
    });
  }


  /**
   * Servicio que permite obtener la lista de comisiones de acuerdo al seller.
   *
   * Este servicio trae el árbol más pequeño.
   * @param {StoreModel} store
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  getSellerCommissionCategory(store: StoreModel): Observable<[{}]> {

    return new Observable(observer => {
      this.http.get(this.api.get('getSellerCommissionCategory', [store.IdSeller]), { observe: 'response' })
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
          observer.next(error);
        }
        );
    });
  }

  /**
   * Servicio que permite obtener la lista de comisiones de acuerdo al seller.
   *
   * Este servicio trae el arbol más pequeño.
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   * @param params
   */
  public patchSellerCommissionCategory(params: {}): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('getSellerCommissionCategory'), params, { observe: 'response' })
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
   * Servicio que permite obtener toda la lista de comisiones.
   *
   * @returns {Observable<[{}]>}
   * @memberof StoresService
   */
  public getAllSellerCommissionCategory(): Observable<[{}]> {

    return new Observable(observer => {
      // obtengo el endpoint desde el archivo de configuración de endpoints
      this.http.get(this.api.get('getSellerCommissionCategory'), { observe: 'response' })
        .subscribe((data: any) => {
          observer.next(data);
        }, error => {
          observer.next(error);
        }
        );
    });
  }
}

