import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthRoutingService {

    constructor(private http: HttpClient,
        private api: EndpointService) { }

    public getPermissions(): Observable<any> {
        return this.http.get(this.api.get('getPermissions'));
        // return this.http.get(this.api.get('getRegexBasic', params), { observe: 'response' });
    }

    getUser() {
        return this.http.get(this.api.get('getSellerData'));
    }
}
