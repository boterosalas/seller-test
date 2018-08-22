import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Logger } from '../util/logger.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Agrega un manejador de error predeterminado a todas las solicitudes.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) { }


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
          this.snackBar.open('Error en la red, Parece que no estás conectado a internet, por favor verifica tu conexión.', 'Cerrar', {
            duration: 3000,
          });
        } else {
          // Manejar Http Error (error.status === 403, 404 ...)
          message = 'Hubo un problema en la petición HTTP:';
          this.snackBar.open('Se produjo un error al realizar la petición al servidor.', 'Cerrar', {
            duration: 3000,
          });
        }
      } else {
        // Manejar errores del cliente (Angular Error, ReferenceError...)
        message = 'Algo anda mal en el cliente:';
        this.snackBar.open('No se pudo realizar la petición al servidor, Ocurrió un error.', 'Cerrar', {
          duration: 3000,
        });
      }
      log.error(`${message} `, error);
    }

    throw error;
  }

}
