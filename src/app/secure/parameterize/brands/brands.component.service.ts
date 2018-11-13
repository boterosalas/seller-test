import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class BrandService {

    constructor(
        private http: HttpClient
        ) {
    }

    public getBrands(): Observable<any> {
        return of();
    }

    public getBrand(id: number): Observable<any> {
        return of();
    }

    public setBrand(model: any): Observable<any> {
        return of();
    }

    public updateBrand(model: any): Observable<any> {
        return of();
    }

    public deleteBrand(id: number): Observable<any> {
        return of();
    }

}
