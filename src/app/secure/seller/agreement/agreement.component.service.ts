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
    constructor(private http: HttpClient, private api: EndpointService) {}

    /**
     * Servicio para obtener los acuerdos por vendedor
     *
     * @param {number} idSeller
     * @returns {Observable<any>}
     * @memberof AgreementService
     */
    public getAgreements(idSeller: number): Observable<any> {
        return this.http.get(this.api.get('getTermsBySeller', [idSeller]));
    }
}
