import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { map } from 'rxjs/operators';

const DataArrray = [
    { 'size': 'XS' },
    { 'size': 'S' },
    { 'size': 'M' },
    { 'size': 'L' },
    { 'size': 'XL' },
    { 'size': 'XXL' },
    { 'size': 'XXXL' },
];

@Injectable()
export class BasicInformationService {

    constructor(private http: HttpClient,
        private api: EndpointService) { }
    /**
     * @param {*} params parametro del modulo
     * @returns {Observable<any>}
     * @memberof BasicInformationRegex
     */
    public getRegexInformationBasic(params: any): Observable<any> {
        return this.http.get(this.api.get('getRegexBasic', params), { observe: 'response' });
    }

    /**
     *  @memberof ListBrands
     */

    getActiveBrands(): Observable<any> {
        const active = 'null/null/1/null/null/null';
        return this.http.get(this.api.get('getActiveBrands') + active)
            .pipe(map((resp: any) => {
                return JSON.parse(resp.body);
            }));
    }
    /**
     * Funcion para consumir el end point de tallas
     *
     * @returns {Observable<any>}
     * @memberof BasicInformationService
     */
    getSizeProducts(): Observable<any> {
        return new Observable(
            observer => {
                observer.next(DataArrray);
            });
    }
}
