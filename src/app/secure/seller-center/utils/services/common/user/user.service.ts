
/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import { HttpErrorHandlingService } from '../../../http/http-error-handling.service';
import { EndpointService } from '../../../http/endpoint.service';
import { Logger } from '../../../logger.service';
import { Const } from '../../../../../../shared/util/constants';
import { User } from '../../../../../../shared/models/login.model';
import { environment } from '../../../../../../environments/environment';


// log component
const log = new Logger('UserService');

@Injectable()

export class UserService {

    /**
     * Creates an instance of UserService.
     * @param {HttpClient} http
     * @param {HttpErrorHandlingService} hehs
     * @param {EndpointService} api
     * @memberof UserService
     */
    constructor(
        private http: HttpClient,
        private hehs: HttpErrorHandlingService,
        private api: EndpointService
    ) { }

    /**
     * Método para obtener un usuario vacio
     * @returns
     * @memberof UserService
     */
    getEmptyUser() {
        return Const.EMPTYUSER;
    }

    /**
     * Método para obtener los datos del usuario
     * @returns
     * @memberof UserService
     */
    getUser() {

        try {
            const user: User = JSON.parse(localStorage.getItem('sellerId'));
            return user || Const.EMPTYUSER;
        } catch (e) {
            log.error(e);
            return Const.EMPTYUSER;
        }
    }

    /**
     * Metodo para setear los datos del usuario
     * @param {any} data
     * @memberof UserService
     */
    setUser(data) {
        localStorage.setItem('user', data);
        JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Método para obtener el perfil del usuario
     * @param {any} token
     * @returns {Observable<{ UserInformation }>}
     * @memberof UserService
     */
    getProfileUser(token): Observable<{ UserInformation }> {

        return new Observable(observer => {
            const headers = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                })
            };
            this.http.get(`${environment.auth0.url}/userinfo`, headers).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }
}
