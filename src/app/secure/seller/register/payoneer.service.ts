import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable()
export class PayoneerService {
    constructor(private http: HttpClient, private api: EndpointService) {}

    public getStatusById(id: any) {
        const url = `${this.api.get('payoneer')}/payees/${id}/status`;
        return this.http.get(url, {observe: 'response'});
    }
}