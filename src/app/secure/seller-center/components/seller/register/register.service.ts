import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CognitoUtil } from '../../../../../service/cognito.service';

@Injectable()
export class RegisterService {
  writerRegister = 'https://5a1c7n6t70.execute-api.us-east-1.amazonaws.com/RegisterSeller/';
  writerValidateSellerNit = 'https://5avfpnwghf.execute-api.us-east-1.amazonaws.com/ValidateSellerNit';
  writeValidateSellerEmail = 'https://iye9w7rlsg.execute-api.us-east-1.amazonaws.com/ValidateSellerEmail';
  writerValidateSellerName = 'https://4gxrzfojb9.execute-api.us-east-1.amazonaws.com/ValidateSellerName';
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
        console.log('Hace falta parametro');
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
