/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import { environment } from './../../../../environments/environment';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { LoginModel } from '../../shared/models/login.model';
import { EndpointService } from '../../../core/http/endpoint.service';
import { BaseAuthService } from '../../shared/services/base-auth.service';

/**
 * Injectable
 */
@Injectable()

/**
 * Clase LoginService
 */
export class LoginService extends BaseAuthService {

    /**
     * Metodo para iniciar sesión
     * @param {any} information
     * @returns {Observable<{ LoginModel }>}
     * @memberof LoginService
     */
    loginUser(information): Observable<{ LoginModel }> {

        this.changeEndPoint();
        return new Observable(observer => {

            this.http.post(this.api.get('login'), information, this.getHeaders()).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }

    /**
     * Método para cerrar sesión
     * @param {any} token
     * @returns {Observable<{}>}
     * @memberof LoginService
     */
    logout(token): Observable<{}> {

        this.changeEndPoint();
        return new Observable(observer => {

            this.http.post(this.api.get('logout'), this.getHeaders()).subscribe(data => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }

    /**
     * Metodo para recuperar contraseña
     * @param {any} data
     * @returns
     * @memberof LoginService
     */
    recoveryPassword(data) {
        this.changeEndPoint();
        return new Observable(observer => {

            this.http.post(this.api.get('recovery'), this.getHeaders()).subscribe(information => {
                observer.next(information);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }
}
