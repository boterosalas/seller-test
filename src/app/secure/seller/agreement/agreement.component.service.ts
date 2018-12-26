import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EndpointService } from '@app/core';

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
    constructor(private http: HttpClient, private api: EndpointService) {}

    public  getAgreements(idSeller: number): Observable<any> {
        return this.http.get(this.api.get('getTermsBySeller', [idSeller]));
    }

    public getPDF():  Observable<any> {
        return of('www.exito.com');
    }

}
