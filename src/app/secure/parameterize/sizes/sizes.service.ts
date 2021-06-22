import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { ParamSpecsService } from '../specifications/specifications.component.service';

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

  /**
   * Servicio para cambiar de estado
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof SizesService
   */
  public changeStatus(params: any): Observable<any> {
    return this.http.patch(this.api.get('getAllSizes'), params, { observe: 'response' });
  }

  /**
   * Servicio para eliminar tallas
   * @param {*} params
   * @returns {Observable<any>}
   * @memberof SizesService
   */
  public deleteSize(params: any): Observable<any> {
    return this.http.delete(this.api.get('getAllSizes', [params]));
  }

  /**
   * Servicio masiva o unitaria de tallas
   * @param {*} data
   * @returns
   * @memberof SizesService
   */
  public createSizes(data: any) {
    return this.http.post(this.api.get('parametrizeSizes'), data);
  }

  public updateSizes(data: any) {
    return this.http.patch(this.api.get('parametrizeSizes'), data);
  }

  public statusSize() {
    return this.http.get(this.api.get('statusSizes'), { observe: 'response' });
  }
}
