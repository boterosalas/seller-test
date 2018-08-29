/* 3rd party components */
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Logger } from './logger.service';

/* our own custom components */


const log = new Logger('HttpErrorHandlingService');

@Injectable()
export class HttpErrorHandlingService {
    /**
     * Creates an instance of HttpErrorHandlingService.
     * @param {MatSnackBar} snackBar
     * @memberof HttpErrorHandlingService
     */
    constructor(public snackBar: MatSnackBar) { }

    /**
     * Maneja de forma global todos posibles errores de una petición http.
     *
     * @param {HttpErrorResponse} err
     * @param {Function} [callback]
     * @memberof HttpErrorHandlingService
     */
    error(err: HttpErrorResponse, callback?: Function) {
        if (err.error instanceof Error) {
            log.debug('An error occurred:', err.error.message);
            // No hay internet
            if (!navigator.onLine) {
                // tslint:disable-next-line:max-line-length
                this.snackBar.open('Error en la red, Parece que no estás conectado a internet, por favor verifica tu conexión.', 'Cerrar', {
                    duration: 3000,
                });
            } else {
                // Se produjo un error en el lado del cliente.
                this.snackBar.open('No se pudo realizar la petición al servidor, Ocurrió un error.', 'Cerrar', {
                    duration: 3000,
                });
            }
        } else {
            // El servidor devolvió un código de respuesta fallido.
            // El cuerpo de respuesta puede contener pistas sobre lo que salió mal.
            this.snackBar.open('Se produjo un error al realizar la petición al servidor.', 'Cerrar', {
                duration: 3000,
            });
            log.debug(`Backend returned code ${err.status}, body was: `, err.error);
        }
        if (callback) {
            callback();
        }
    }
}
