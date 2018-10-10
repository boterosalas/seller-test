import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '@app/core';

@Injectable()
export class RegisterService {

    constructor(
        private http: HttpClient,
        private api: EndpointService) {
    }

     // @method fetchData
   //  @param paramValue
   // @param param
   // @description Método para validar los datos de EAN
   // @memberof RegisterService
   //

    fetchData(paramValue: {}, param: any): Observable<{}> {
        let writeUrl: any;
        switch (param) {
            case 'Ean':
                writeUrl = 'validateEan';
                break;
        }

        return new Observable(observer => {
            this.http.get<any>(this.api.get(writeUrl, [paramValue]), { observe: 'response' })
                .subscribe(
                    data => {
                        observer.next(data);
                    },
                    error => {
                        observer.next(error);
                    }
                );
        });
    }
}
