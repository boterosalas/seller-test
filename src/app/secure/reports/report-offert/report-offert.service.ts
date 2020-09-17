import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class ReportOffertService {

    constructor(
        private http: HttpClient,
        private api: EndpointService,
    ) { }

    downloadReportOffertAdmin(email: string): Observable<{}> {
        const exportData = {
            Email: email,
        };
        return this.http.post<any>(this.api.get('reportsOfferAdmin'), exportData, { observe: 'response' });
    }

    downloadReportErrorVtexAdmin(email: string): Observable<{}> {
        const exportData = {
            Email: email,
        };
        return new Observable(observer => {
            observer.next(exportData);
          });
        // return this.http.post<any>(this.api.get('reportsOfferAdmin'), exportData, { observe: 'response' });
    }
}
