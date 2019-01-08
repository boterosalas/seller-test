import { Injectable, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class CommonService {

    /** RegexName */
    nameRegexResponse = 'validationImportProduct';
    nameRegexEan = 'ean';
    nameRegexReason = 'validationImportReason';
    nameRegexComment = 'validationImportObservation';
    firstTime = true;
    allRegex: Observable<any>;
    @Output() chargeAgain: EventEmitter<boolean> = new EventEmitter();

    constructor(private http: HttpClient,
        private api: EndpointService) { }

    /**
     * @param {*} params parametro del modulo
     * @returns {Observable<any>}
     * @memberof BasicInformationRegex
     */
    public getRegexByParam(params: any): Observable<any> {
        return this.http.get(this.api.get('getRegexBasic', params), { observe: 'response' });
    }

    /**
     * Ya que el servicio en angular es difinido con un patron de singleton, solo se va a instanciar una vez.
     * ya cuando posea las regex del servicio seguira retornando esta N veces sea necesaria solo que no ira mas al
     * servicio.
     *
     * @returns {Observable<any>}
     * @memberof CommonService
     */
    public getAllRegex(): Observable<any> {
        if (this.firstTime) {
            this.allRegex =  this.http.get(this.api.get('getRegexBasic'), { observe: 'response' });
        }
        return this.allRegex;
    }

    public chargeAgainService(): void {
        this.chargeAgain.emit(true);
    }

    /**
     * @param {*} params parametro del modulo
     * @returns {Observable<any>}
     * @memberof BasicInformationRegex
     */
    public postBillOrders(body: any): Observable<any> {
        return this.http.patch(this.api.get('uploadBilling'), body, { observe: 'response' });
    }
}
