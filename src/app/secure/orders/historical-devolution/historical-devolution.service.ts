import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { HistoricalDevolutionEntity } from '@app/shared';

@Injectable()
export class HistoricalDevolutionService {
  constructor(private http: HttpClient, private api: EndpointService) {}

  getHistorical(
    stringSearch: string
  ): Observable<HistoricalDevolutionEntity[]> {
    return new Observable(observer => {
      this.http
        .get<HistoricalDevolutionEntity[]>(this.api.get('pendingDevolution', [stringSearch]))
        .subscribe(
          (data) => {
            // Validación debido a que a veces el endpoint solo responde un status 200.
            data = !data ? [] : data;
            observer.next(data);
          },
          err => observer.error(err)
        );
    });
  }
/**
 * funcion para consultar los comentarios devoluciones
 *
 * @param {*} params
 * @returns {Observable<any>}
 * @memberof HistoricalDevolutionService
 */
getAllCommentRefuse(params: any): Observable<any> {
    return new Observable(observer => {
      this.http.post(this.api.get('getAllCommentRefuse'), params)
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }
}
