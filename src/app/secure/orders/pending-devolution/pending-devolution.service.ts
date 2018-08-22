import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Const, ListReasonRejectionResponseEntity } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class PendingDevolutionService {

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) { }

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente
     * @param user
     * @param stringSearch
     * @returns Observable<[{}]>
     */
    getOrders(user: any, stringSearch: any): Observable<[{}]> {
        return new Observable(observer => {

            this.http.get(this.api.get('pendingDevolution', [stringSearch]), ).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                observer.error(err);
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
        return new Observable(observer => {

            this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrderPendingDevolution}`])).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                observer.error(err);
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
        return new Observable(observer => {

            this.http.get(this.api.get('acceptDevolution')).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                observer.error(err);
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
        return new Observable(observer => {
            this.http.post(this.api.get('refuseOrAcceptDevolution'), info, ).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                observer.error(err);
            });
        });
    }
}
