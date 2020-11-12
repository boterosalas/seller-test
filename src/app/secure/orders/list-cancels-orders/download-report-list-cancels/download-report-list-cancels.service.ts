import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { EndpointService } from '@app/core';
import { Order } from '@app/shared';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';

@Injectable()
/**
 * Clase OrderService
 */
export class ListDownloadOrdersService {

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) { }

    public sendEmailExportListsCancel(body: any): Observable<any> {
        return this.http.post(this.api.get('exportListCancel'), body);
    }


}
