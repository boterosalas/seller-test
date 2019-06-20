import { HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil } from '@core/aws-cognito';
import { Buffer } from 'buffer';


/**
 * Intercepta todas las peticiones y les agrega el token de la autenticación en el encabezado.
 *
 * @export
 * @class AuthInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cognitoUtil: CognitoUtil) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if(!req.url.toString().includes('assets')) {
      const idToken = this.cognitoUtil.getTokenLocalStorage();
      const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

      // Clona la solicitud y reemplaza los encabezados originales con
      // encabezados actualizados con la autorización.
      const authReq = req.clone({
        headers: headers
      });

      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
