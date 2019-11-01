// import { HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { CognitoUtil } from '@core/aws-cognito';
// import { Buffer } from 'buffer';


// /**
//  * Intercepta todas las peticiones y les agrega el token de la autenticación en el encabezado.
//  *
//  * @export
//  * @class AuthInterceptor
//  * @implements {HttpInterceptor}
//  */
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private cognitoUtil: CognitoUtil) {
//   }

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//       const idToken = this.cognitoUtil.getTokenLocalStorage();
//       const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

//       // Clona la solicitud y reemplaza los encabezados originales con
//       // encabezados actualizados con la autorización.
//       const authReq = req.clone({
//         headers: headers
//       });

//       return next.handle(authReq);
//   }
// }

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
    if (!req.url.toString().includes('assets')) {
      const idToken = this.cognitoUtil.getTokenLocalStorage();
      const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });
      const culture = this.addCulture(req);
      /* Clona la solicitud y reemplaza los encabezados originales con
       encabezados actualizados con la autorización.
      colocar la variable de url modificada para la cultura (idioma) */
      const authReq = req.clone({
        headers: headers,
        url: req.url + culture
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }

  addCulture(req: HttpRequest<any>) {
    if (req && req.url) {
      let currencyCulture = 'es-CO';
      if (localStorage.getItem('culture_current')){
        currencyCulture = localStorage.getItem('culture_current');
      }
      if (currencyCulture === 'es' || currencyCulture === 'ES' || currencyCulture === 'es-CO') {
        currencyCulture = 'es-CO';
      } else {
        currencyCulture = 'en-US';
      }
      const validate = req.url.includes('?') || req.url.includes('&') ;
        if (validate) {
          const culture = '&culture=' + currencyCulture;
          return  culture;
        } else {
          const culture = '/?culture=' + currencyCulture;
          return  culture;
        }
    }
  }
}