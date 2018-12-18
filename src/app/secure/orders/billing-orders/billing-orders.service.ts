import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface BillingOrders {
    Id: number;
    Number: number;
    Name: string;
}

@Injectable()
export class BillingOrdersService {
    objecto = [{
        Id: 1,
        Number: '123456',
        Name: 'Factura 1 10/15/2018'
    }, {
        Id: 1,
        Number: '456789',
        Name: 'Factura 2 10/15/2019'
    }];
    constructor(private http: HttpClient) {}

    public  getBillingOrders(idOrder: number): Observable<any> {
        if (idOrder === 673240007) {
            return of(this.objecto);
        } else {
            return of(null);
        }
        // this.http.get();
    }
    public getPDFOrders():  Observable<any> {
        return of('www.exito.com');
    }
}
