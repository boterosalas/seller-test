/* 3rd party components */
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import { BaseSellerService } from '../../../../../shared/services/base-seller.service';
import { User } from '../../../../../shared/models/login.model';


@Injectable()
/**
 * Clase BillingService
 */
export class InValidationService extends BaseSellerService {

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente
     * @param user
     * @param guide
     * @returns Observable<[{}]>
     */
    getOrders(user: User, stringSearch: any): Observable<[{}]> {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.get(this.api.get('pendingDevolution', [stringSearch]), this.getHeaders(user)).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }


    /**
     * Método para realizar la aceptación de una devolución
     * @param {any} user
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    acceptDevolution(user): Observable<[{}]> {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.get(this.api.get('acceptDevolution'), this.getHeaders(user)).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }

    /**
     * Método para realizar el rechazo de una devolución
     * @param {any} user
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    reportNovelty(user): Observable<[{}]> {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.get(this.api.get('reportNovelty'), this.getHeaders(user)).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }
}
