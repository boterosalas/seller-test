import { Injectable } from '@angular/core';
import { BaseSellerService, Const, ListReasonRejectionResponseEntity } from '@root/src/app/shared';
import { Observable } from 'rxjs';


@Injectable()
export class InDevolutionService extends BaseSellerService {

    /**
     * Método para realiar la consulta de las órdenes en estado pendiente.
     * 
     * @param user
     * @param guide
     * @returns Observable<[{}]>
     */
    getOrders(stringSearch: any): Observable<[{}]> {
        return new Observable(observer => {
            this.http.get(this.api.get('pendingDevolution', [stringSearch]), this.getHeaders())
                .subscribe((data: any) => {
                    // Validación debido a que a veces el endpoint solo responde un status 200.
                    data = (!data) ? [] : data;
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
     * @memberof InDevolutionService
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
     * Método para realiar la consulta de las opciones para realizar el rechazo.
     * 
     * @returns {Observable<[{ListReasonRejectionResponseEntity}]>}
     * @memberof InDevolutionService
     */
    getReasonsRejection(): Observable<Array<ListReasonRejectionResponseEntity>> {
        return new Observable(observer => {
            this.http.get(this.api.get('getreasonsrejection', [
                `?reversionRequestRejectionType=${Const.OrdersInDevolution}`
            ]), this.getHeaders()).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                this.hehs.error(err, () => {
                    observer.error(err);
                });
            });
        });
    }

    /**
     * Método para realizar el rechazo de una devolución.
     * 
     * @param info
     * @returns {Observable<[{}]>}
     * @memberof InDevolutionService
     */
    reportNovelty(info): Observable<[{}]> {
        return new Observable(observer => {
            this.http.post(this.api.get('refuseOrAccepDevolution'), info, this.getHeaders())
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
