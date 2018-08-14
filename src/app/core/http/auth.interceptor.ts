import { Injectable } from '@angular/core';
import { CognitoUtil } from '@app/shared';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

/**
 * Intersecta todas las peticiones y les agrega el token de la autenticación en el encabezado.
 *
 * @export
 * @class AuthInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private cognitoUtil: CognitoUtil) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const idToken = this.cognitoUtil.getTokenLocalStorage();

        // Clona la solicitud y reemplaza los encabezados originales con
        // encabezados actualizados con la autorización.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', idToken)
        });

        return next.handle(authReq);
    }
}