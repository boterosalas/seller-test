import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../util/logger.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Agrega un manejador de error predeterminado a todas las solicitudes.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  private errorHandler(error: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      let message: string;

      if (error instanceof HttpErrorResponse) {
        // Ha ocurrido un error en el servidor o la conexión.
        if (!navigator.onLine) {
          // Gestionar error offline.
          message = 'Parece que no estas conectado a una red.';
        } else {
          // Manejar Http Error (error.status === 403, 404 ...)
          message = 'Hubo un problema en la petición HTTP:';
        }
      } else {
        // Manejar errores del cliente (Angular Error, ReferenceError...)
        message = 'Algo anda mal en el cliente:';
      }
      log.error(`${message} `, error);
    }

    throw error;
  }

}
