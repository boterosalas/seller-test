import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable()

export class AsignateimageService {
    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) {

    }
    // Servicio para verificar si la imagen es valida o no.
    getvalidateImage(validateImage: any): Observable<any> {
        return this.http.patch(this.api.get('getValidateImage'), validateImage);
    }
}

