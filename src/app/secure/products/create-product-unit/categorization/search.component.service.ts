import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EndpointService } from '@app/core';

@Injectable()
export class SearchService {


    categorySelected: string;
    @Output() change: EventEmitter<string> = new EventEmitter();

    constructor(
        private http: HttpClient,
        private api: EndpointService
    ) {

    }

    /**
     * Servicio para obtener las categorias
     * TODO: Eliminar json interno, usar servicio.
     *
     * @returns {Observable<{}>}
     * @memberof SearchService
     */
    public getCategories(): Observable<{}> {
        return new Observable(observer => {
            this.http.get(this.api.get('getSellerCommissionCategory'), { observe: 'response' })
                .subscribe((data: any) => {
                    observer.next(data);
                }, error => {
                    observer.next(error);
                }
                );
        });
    }

    public getCategory(): Observable<any> {
        return of(this.categorySelected);
    }

    public setCategory(category: string): void {
        this.categorySelected = category;
        this.change.emit(category);
    }


}
