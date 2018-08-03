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

  constructor(private http: HttpClient,  public cognitoUtil: CognitoUtil) {
  }

  /**
   *
   * @param paramValue
   * @param param
   */
  fetchData(paramValue: {}, param: any): Observable<{}> {
    let writeUrl: any;
    switch (param) {
      case 'nit':
        writeUrl = this.writerValidateSellerNit;
        break;
      case 'email':
        writeUrl = this.writeValidateSellerEmail;
        break;
      case 'nomTienda':
        writeUrl = this.writerValidateSellerName;
        break;
      default:
        console.log('one parameter is missing');
    }
    const url = writeUrl + '/' + paramValue;
    const idToken =  this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});

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
   *
   * @param params
   */
  registerUser(params: {}): Observable<{}> {
    const idToken =  this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8'});

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
