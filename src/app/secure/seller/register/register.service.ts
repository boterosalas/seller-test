import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '@app/shared';
import { endpoints, defaultVersion } from '../../../../../api-endpoints';

@Injectable()
export class RegisterService {
  writerRegister = endpoints[defaultVersion.prefix + defaultVersion.number]['registerSeller'];
  writerValidateSellerNit = endpoints[defaultVersion.prefix + defaultVersion.number]['validateSellerNit'];
  writeValidateSellerEmail = endpoints[defaultVersion.prefix + defaultVersion.number]['validateSellerEmail'];
  writerValidateSellerName = endpoints[defaultVersion.prefix + defaultVersion.number]['validateSellerName'];
  httpOptions: any;

  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil
  ) { }

  /**
   * @method fetchData
   * @param paramValue
   * @param param
   * @description Metodo para validar los datos de: NIT, E-mail, Nombre de la tienda
   * @memberof RegisterService
   */
  fetchData(paramValue: {}, param: any): Observable<{}> {
    let writeUrl: any;
    switch (param) {
      case 'Nit':
        writeUrl = this.writerValidateSellerNit;
        break;
      case 'Email':
        writeUrl = this.writeValidateSellerEmail;
        break;
      case 'Name':
        writeUrl = this.writerValidateSellerName;
        break;
      default:
        console.log('one parameter is missing');
    }
    const url = writeUrl + '/' + paramValue;
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

    return new Observable(observer => {
      this.http.get<any>(url, { observe: 'response', headers: headers })
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
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
    console.log('parametros para el servicio', params);
    return new Observable(
      observer => {
        this.http.post<any>(this.writerRegister, params, { observe: 'response', headers: headers }).subscribe(
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
