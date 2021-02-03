import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportDispersionService {

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) { }

    public sendReportDispersion(body: any): Observable<any> {
        const listSeller = body.listSeller;
        const email = '?email=' + body.email;
        return this.http.post(this.api.get('sendModuleReportDispersion', [email]), listSeller);
    }
}