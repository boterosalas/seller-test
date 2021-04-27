import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable()
export class SizesService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  /**
   * Ser listar tallas, pagTOken, limit
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof SizesService
   */
  public getListSizes(params: any): Observable<any> {
    return this.http.get(this.api.get('getAllSizes', [params]));
  }
}
