import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

/*
export interface BillingOrders {
    Id: number;
    Number: number;
    Name: string;
} */

@Injectable()
export class BillingOrdersService {
    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) {}

    public  getBillingOrders(idOrder: number): Observable<any> {
        return this.http.get(this.api.get('getBillingOrders', [idOrder]));
    }

}
