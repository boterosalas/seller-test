/* 3rd party components */
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* our own custom components */
import { EndpointService } from "../../../core/http/endpoint.service";
import { environment } from './../../../../environments/environment';
import { HttpErrorHandlingService } from "../../../core/http/http-error-handling.service";
import { User } from '../models/login.model';

@Injectable()

export class BaseShipmentService extends EndpointService {
    constructor(
        protected http: HttpClient,
        protected error: HttpErrorHandlingService,
        protected api: EndpointService) {
        super();
    }

    /**
    * Método para aplicar la url a emplear en los servicios
    * @memberof BaseShipmentService
    */
    changeEndPoint() {
        this.api.apiUrl = environment.endpoints.shipments;
    }

    /**
     * Método para indicar los headers a usar en los servicio
     * @returns {{headers: HttpHeaders}}
     */
    getHeaders(user: User): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Token ${user.access_token}`
            })
        };
    }
}