import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';



@Injectable()
/**
 * Clase BillingService
 */
export class InValidationService {

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
    getOrders(user: any, stringSearch: any): Observable<[{}]> {
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
     * @returns {Observable<[{}]>}
     * @memberof PendingDevolutionService
     */
    reportNovelty(user): Observable<[{}]> {
        return new Observable(observer => {
            this.http.get(this.api.get('reportNovelty')).subscribe((data: any) => {
                observer.next(data);
            }, err => {
                observer.error(err);
            });
        });
    }
}
