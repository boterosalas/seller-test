

/* 3rd party components */
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* our own custom components */
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';

@Injectable()

export class BaseAuthService extends EndpointService {
    /**
     * Creates an instance of BaseAuthService.
     * @param {ComponentsService} ComponentsService
     * @param {HttpClient} http
     * @param {HttpErrorHandlingService} hehs
     * @param {EndpointService} api
     * @memberof BaseAuthService
     */
    constructor(
        protected componentsService: ComponentsService,
        protected http: HttpClient,
        protected hehs: HttpErrorHandlingService,
        protected api: EndpointService
    ) {
        // para indicar cual url de api emplear debo de sobreescribir EndPorintService.
        super();
    }

    /**
     * Método para aplicar la url a emplear en los servicios
     * @memberof BaseAuthService
     */
    changeEndPoint() {
        // Empleo la url para el seller center
        this.api.apiUrl = environment.auth0.url;
    }

    /**
     * Método para indicar los headers a usar en los servicio
     * @returns {{headers: HttpHeaders}}
     */
    getHeaders(): { headers: HttpHeaders } {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }
}
