/* 3rd party components */
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import {
    BaseSellerService,
    ListReasonRejectionResponseEntity,
    Const
} from '@app/shared';
/**
 * Injectable
 */
@Injectable()

/**
 * Clase BillingService
 */
export class PendingDevolutionService extends BaseSellerService {

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente
     * @param user
     * @param stringSearch
     * @returns Observable<[{}]>
     */
    getOrders(user: any, stringSearch: any): Observable<[{}]> {

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
     * Método para realiar la consulta de las opciones para realizar el rechazo
     * @param {User} user
     * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
     * @memberof PendingDevolutionService
     */
    getReasonsRejection(user: any): Observable<Array<ListReasonRejectionResponseEntity>> {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrderPendingDevolution}`]),
                this.getHeaders(user)).subscribe((data: any) => {
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
     * @param info
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    refuseDevolution(user: any, info): Observable<[{}]> {

        this.changeEndPoint();

        return new Observable(observer => {
            this.http.post(this.api.get('refuseOrAcceptDevolution'), info, this.getHeaders(user)).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }
}
