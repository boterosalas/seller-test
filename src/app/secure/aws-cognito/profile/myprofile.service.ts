import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable()
export class MyProfileService {
    constructor(private http: HttpClient, private api: EndpointService) { }

    getUser() {
        return this.http.get(this.api.get('getSellerData'), { observe: 'response' });
    }
    getAllContactData() {
        return this.http.get(this.api.get('getAllContactData'), { observe: 'response' });
    }
}
