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

        /*
        return new Observable(observer => {
            this.http.post<any>(this.api.get('reportsOfferAdmin'), exportData,  {observe: 'response' })
                .subscribe((data: any) => {
                    observer.next(data);
                }, err => {
                    observer.error(err);
                });
        }); */
    }
}
