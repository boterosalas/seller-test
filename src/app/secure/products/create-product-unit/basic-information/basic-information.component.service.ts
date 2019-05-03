import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

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

    // getListBrands() {

    // }

}
