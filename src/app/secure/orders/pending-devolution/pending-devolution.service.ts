import { Injectable } from '@angular/core';
import { BaseSellerService, Const, ListReasonRejectionResponseEntity } from '@app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class PendingDevolutionService extends BaseSellerService {

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente.
     *
     * @param stringSearch
     * @returns Observable<[{}]>
     */
    getOrders(stringSearch: any): Observable<[{}]> {
        return new Observable(observer => {
            this.http.get(this.api.get('pendingDevolution', [stringSearch]), this.getHeaders())
                .subscribe((data: any) => {
                    data = data ? data : [];
                    observer.next(data);
                }, err => {
                    this.hehs.error(err, () => {
                        observer.error(err);
                    });
                });
        });
    }

    /**
     * Método para realiar la consulta de las opciones para realizar el rechazo.
     *
     * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
     * @memberof PendingDevolutionService
     */
    getReasonsRejection(): Observable<Array<ListReasonRejectionResponseEntity>> {
        return new Observable(observer => {
            this.http.get(this.api.get('getreasonsrejection', [`?reversionRequestRejectionType=${Const.OrderPendingDevolution}`]),
                this.getHeaders())
                .subscribe((data: any) => {
                    observer.next(data);
                }, err => {
                    this.hehs.error(err, () => {
                        observer.error(err);
                    });
                });
        });
    }

    /**
     * Método para realizar la aceptación de una devolución.
     *
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    acceptDevolution(): Observable<[{}]> {
        return new Observable(observer => {
            this.http.get(this.api.get('acceptDevolution'), this.getHeaders())
                .subscribe((data: any) => {
                    observer.next(data);
                }, err => {
                    this.hehs.error(err, () => {
                        observer.error(err);
                    });
                });
        });
    }

    /**
     * Método para realizar la aceptación o el rechazo de una devolución.
     *
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    acceptOrDeniedDevolution(info): Observable<[{}]> {
        return new Observable(observer => {
            this.http.post(this.api.get('acceptOrDeniedDevolution'), info, this.getHeaders())
                .subscribe((data: any) => {
                    observer.next(data);
                }, err => {
                    this.hehs.error(err, () => {
                        observer.error(err);
                    });
                });
        });
    }
}
