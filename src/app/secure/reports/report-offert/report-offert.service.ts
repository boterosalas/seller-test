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

        // return new Observable(observer => {
        //     this.http.post<any>(this.api.get('exportBillingPays'), exportData)
        //         .subscribe((data: any) => {
        //             observer.next(data);
        //         }, err => {
        //             observer.error(err);
        //         });
        // });

        return of(
            {
                status: 200,
                body: {
                    'errors': [],
                    'data': {
                        'idSeller': 1,
                        'status': 3,
                        'response': '',
                        'checked': 'false'
                    },
                    'message': 'Operación realizada éxitosamente.'
                }
            }
        );
    }
}
