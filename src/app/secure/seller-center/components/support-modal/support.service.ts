/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import { BaseSellerService } from '../../../../shared/services/base-seller.service';

@Injectable()

/**
 * Clase Support Service, clase empleada para los servicios necesarios en el proceso de envio de mensaje de soporte
 */
export class SupportService extends BaseSellerService {

    /**
     * Método para realiar el envío del mensaje de soporte
     * @param {any} token
     * @param {any} supportMessage
     * @returns
     * @memberof SupportService
     */
    sendSupportMessage(user, supportMessage) {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.post(this.api.get('supporMessage'), supportMessage, this.getHeaders(user)).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }
}

