import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';

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
    ) { }

    public getBillingOrders(idOrder: number): Observable<any> {
        return this.http.get(this.api.get('getBillingOrders', [idOrder]));
    }

    public getDownnLoadBilling(url: any): Observable<any> {
        let headers = new HttpHeaders();
        if (url && url.length === 1) {
            headers = headers.set('Accept', 'application/pdf');
        } else {
            headers = headers.set('Accept', 'application/zip');
        }
        return this.http.post(this.api.get('postBillingOrders'), url, { headers: headers, responseType: 'blob' });
    }
}

