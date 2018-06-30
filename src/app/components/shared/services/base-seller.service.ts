/* 3rd party components */
import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* our own custom components */
import { ComponentsService } from '../../../core/services/common/components/components.service';
import { EndpointService } from '../../../core/http/endpoint.service';
import { HttpErrorHandlingService } from '../../../core/http/http-error-handling.service';
import { User } from '../models/login.model';

/**
 * Injectable
 */
@Injectable()

export class BaseSellerService extends EndpointService {
    /**
    * Creates an instance of LoadGuideService.
    * @param {ComponentsService} ComponentsService
    * @param {HttpClient} http
    * @param {HttpErrorHandlingService} hehs
    * @param {EndpointService} api
    * @memberof LoadGuideService
    */
    constructor(
        // tslint:disable-next-line:no-shadowed-variable
        protected ComponentsService: ComponentsService,
        protected http: HttpClient,
        protected hehs: HttpErrorHandlingService,
        protected api: EndpointService
    ) {

        // para indicar cual url de api emplear debo de sobreescribir EndPorintService.
        super();
    }

    /**
     * Método para aplicar la url a emplear en los servicios
     * @memberof BaseSellerService
     */
    changeEndPoint() {
        this.api.apiUrl = environment.endpoints.seller;
    }

    /**
     * Método para indicar los headers a usar en los servicio
     * @returns {{headers: HttpHeaders}}
     */
    getHeaders(user: User): { headers: HttpHeaders } {
        // Empleo la url para el seller center
        this.changeEndPoint();
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.access_token}`
            })
        };
    }
}
