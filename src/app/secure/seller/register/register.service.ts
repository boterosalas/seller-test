import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { Logger } from '@core/util/logger.service';

const log = new Logger('RegisterService');

@Injectable()
export class RegisterService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * @method fetchData
   * @param paramValue
   * @param param
   * @description Método para validar los datos de: NIT, E-mail, Nombre de la tienda
   * @memberof RegisterService
   */
  fetchData(paramValue: {}, param: any): Observable<{}> {
    let writeUrl: any;
    switch (param) {
      case 'Nit':
        writeUrl = 'validateSellerNit';
        break;
      case 'Email':
        writeUrl = 'validateSellerEmail';
        break;
      case 'Name':
        writeUrl = 'validateSellerName';
        break;
      default:
        log.error('one parameter is missing');
    }

    return new Observable(observer => {
      this.http.get<any>(this.api.get(writeUrl, [paramValue]), { observe: 'response' })
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
   * @method registerUser
   * @param params
   * @description Metodo para registrar ell usuario
   * @returns Observable
   * @memberof RegisterService
   */
  registerUser(params: {}): Observable<{}> {
    return new Observable(
      observer => {
        this.http.post<any>(this.api.get('registerSeller'), params, { observe: 'response' }).subscribe(
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
   * Metodo para validar el perfil de registro, Seller o Admin
   *
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof RegisterService
   */
  public typeProfile(): Observable<any> {
    return this.http.get(this.api.get('getTypeProfileAndProfile'));
  }
}
