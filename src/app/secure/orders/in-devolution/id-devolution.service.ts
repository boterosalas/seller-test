import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Const, ListReasonRejectionResponseEntity, User } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
/**
 * Clase BillingService
 */
export class InDevolutionService {

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) { }

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente
     * @param user
     * @param guide
     * @returns Observable<[{}]>
     */
    getOrders(user: User, stringSearch: any): Observable<[{}]> {
        return new Observable(observer => {
            this.http.get(this.api.get('pendingDevolution', [stringSearch])).subscribe((data: any) => {
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
     * @memberof InDevolutionService
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
     * Método para realiar la consulta de las opciones para realizar el rechazo
     * @param {User} user
     * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
     * @memberof InDevolutionService
     */
    getReasonsRejection(user: User): Observable<Array<ListReasonRejectionResponseEntity>> {
        return new Observable(observer => {
            this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrdersInDevolution}`]),
        ).subscribe((data: any) => {
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
     * @memberof InDevolutionService
     */
    reportNovelty(user: User, info): Observable<[{}]> {
        return new Observable(observer => {
            this.http.post(this.api.get('refuseOrAcceptDevolution'), info).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                    observer.error(err);
            });
        });
    }
}
