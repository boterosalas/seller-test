import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';

export interface BrandModel {
    IdBrand: number;
    NameBrand: string;
}

@Injectable()
export class BrandService {

    constructor(
        private http: HttpClient
    ) {
    }

    public getBrands(): Observable<any> {
        return of({
            data: [{
                idBrand: 1,
                brandName: 'hola como estas'
            }, {
                idBrand: 2,
                brandName: 'hola como estas 2'
            }], errors: [], message: ''
        });
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
