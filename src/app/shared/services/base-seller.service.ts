/* 3rd party components */
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/* our own custom components */
import { User } from '../models/login.model';
import { EndpointService } from '../../secure/seller-center/utils/http/endpoint.service';
import { ComponentsService } from '../../secure/seller-center/utils/services/common/components/components.service';
import { HttpErrorHandlingService } from '../../secure/seller-center/utils/http/http-error-handling.service';
import { CognitoUtil } from '../../service/cognito.service';

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
        protected api: EndpointService,
        protected cognitoUtil: CognitoUtil
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
    getHeaders(user?: User): { headers: HttpHeaders } {
        // Empleo la url para el seller center
        this.changeEndPoint();
        const idToken =  this.cognitoUtil.getTokenLocalStorage();
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': idToken
            })
        };
    }
}
