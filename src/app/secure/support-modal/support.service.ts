import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core/http';
import { Observable } from 'rxjs';

/**
 * Clase empleada para los servicios necesarios en el proceso de envio de mensaje de soporte.
 *
 * @export
 * @class SupportService
 */
@Injectable()
export class SupportService {

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) { }

    /**
     * Método para realiar el envío del mensaje de soporte
     * @param {any} token
     * @param {any} supportMessage
     * @returns
     * @memberof SupportService
     */
    sendSupportMessage(user: any, supportMessage: any) {
        return new Observable(observer => {
            this.http.post(this.api.get('supporMessage'), supportMessage).subscribe((data: any) => {
                observer.next(data);
            });
        });
    }
}

