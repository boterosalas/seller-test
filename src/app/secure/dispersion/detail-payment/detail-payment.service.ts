import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class DetailPaymentService {
    public headers: any;


    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) {
    }
}
