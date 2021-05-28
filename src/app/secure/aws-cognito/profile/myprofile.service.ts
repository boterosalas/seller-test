import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MyProfileService {
    constructor(private http: HttpClient, private api: EndpointService) { }

    getUser() {
        return this.http.get(this.api.get('getSellerData'), { observe: 'response' });
    }
    getAllContactData(): Observable<any> {
        return this.http.get(this.api.get('getAllContactData'), { observe: 'response' });
    }

    updateContactData(body): Observable<any> {
        return this.http.patch(this.api.get('updateContactData'), body);
    }
}
