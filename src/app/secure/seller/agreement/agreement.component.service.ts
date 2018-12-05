import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Agreement {
    Id: number;
    Name: string;
}

@Injectable()
export class AgreementService {

    objecto = [{
        Id: 1,
        Name: 'Acuerdo 1 10/15/2018'
    }, {
        Id: 1,
        Name: 'Acuerdo 2 10/15/2019'
    }];
    constructor(private http: HttpClient) {}

    public  getAgreements(idSeller: number): Observable<any> {
        if (idSeller === 10011) {
            return of(this.objecto);
        } else {
            return of(null);
        }
        // this.http.get();
    }

    public getPDF():  Observable<any> {
        return of('www.exito.com');
    }

}
