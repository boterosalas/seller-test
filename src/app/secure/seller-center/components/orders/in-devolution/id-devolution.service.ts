/* 3rd party components */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';

/* our own custom components */
import { User } from '../../../../../shared/models/login.model';
import { BaseSellerService } from '../../../../../shared/services/base-seller.service';
import { ListReasonRejectionResponseEntity } from '../../../../../shared/models/order';
import { Const } from '../../../../../shared/util/constants';


@Injectable()
/**
 * Clase BillingService
 */
export class InDevolutionService extends BaseSellerService {

    /**
     * Método para realiar la consulta de las ordenes en estado pendiente
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
     * @memberof InDevolutionService
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
     * Método para realiar la consulta de las opciones para realizar el rechazo
     * @param {User} user
     * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
     * @memberof InDevolutionService
     */
    getReasonsRejection(user: User): Observable<Array<ListReasonRejectionResponseEntity>> {

        this.changeEndPoint();

        return new Observable(observer => {

            this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrdersInDevolution}`]),
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
     * Método para realizar el rechazo de una devolución
     * @param {any} user
     * @param info
     * @returns {Observable<[{}]>}
     * @memberof InDevolutionService
     */
    reportNovelty(user: User, info): Observable<[{}]> {

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
