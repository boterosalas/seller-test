import { Injectable } from '@angular/core';
import { SpecificationModel } from './specification.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable()
export class SpecificationService {

    constructor(private http: HttpClient,
        private api: EndpointService) { }
    /**
     * Funcion que consume el servicio de obtener grupos de especificaciones y especificaciones.
     *
     * @returns {Observable<SpecificationModel[]>}
     * @memberof SpecificationService
     */
    public getSpecifications(): Observable<any> {
        return this.http.get(this.api.get('getProductSpecs'), { observe: 'response' });
    }
}
