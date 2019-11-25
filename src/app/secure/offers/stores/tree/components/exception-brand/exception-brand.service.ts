import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { StoreModel } from '../../../models/store.model';
@Injectable({
  providedIn: 'root'
})
export class ExceptionBrandService {

  brands = [
    { Name: 'asdlfasdflk' },
    { Name: 'Hydrogen' },
    { Name: 'Helium' },
    { Name: 'Lithium' },
    { Name: 'Beryllium' },
    { Name: 'Boron' },
    { Name: 'Carbon' },
    { Name: 'Nitrogen' },
    { Name: 'Oxygen' },
    { Name: 'Fluorine' },
    { Name: 'Neon' },
    { Name: 'Neon 2' },
    { Name: 'Neon 3' },
    { Name: 'Neon 4' },
    { Name: 'Neon 5' },
    { Name: 'Neon 6' },
    { Name: 'Neon 7' },
  ];

  data = {
    'Type': 1,
    'SellerId': '11226',
    'ExceptionValue': [
      {
        'Id': 1,
        'Comission': 7,
        'IdVTEX': '90066',
        'Brand': 'Clau'
      },
      {
        'Id': 2,
        'Comission': 8,
        'IdVTEX': '90002',
        'Brand': 'Clau2'
      }
    ]
  };
  IdSeller: string;
  Id: string;

  constructor(private api: EndpointService, private http: HttpClient) { }

  /**
   * Serivio que crea las excepciones de marcas
   * @param {*} body
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public createExceptionBrand(body: any): Observable<{}> {
    // return this.http.patch<any>(this.api.get('patchExceptionBrand'), body);
    // return this.http.patch(`${this.api.get('getExceptionBrand')}/CreateComsnExc/${body}`, { observe: 'response' });
    return this.http.post(`${this.api.get('exceptionComissionBrand')}/CreateComsnExc`, body, { observe: 'response' });
  }

  /**
   * Serivio que obtiene las excepciones de marcas
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public getExceptionBrand(param: any): Observable<{}> {
    return this.http.get(`${this.api.get('getExceptionBrand')}/GetComsnExcsBySeller/${param}`, { observe: 'response' });
  }

  /**
   * Serivio que actualiza las excepciones de marcas
   * @param {*} body
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public updateExceptionBrand(body: any): Observable<{}> {
    return this.http.patch(`${this.api.get('exceptionComissionBrand')}/UpdateComsnExc`, body, { observe: 'response' });
  }

  /**
   * Serivio que elimina las excepciones de marcas
   * @param {number} idBrand
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public deleteExceptionBrand(param?: any): Observable<{}> {
    // const deleteComission = `${this.api.get('exceptionComissionBrand')}/DeleteComsnExc`;
    let urlParams: any;
    // this.IdSeller = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;
    // this.this.Id = params === undefined || params.pluVtex === undefined || params.pluVtex === null;
    urlParams = this.IdSeller + '/' + this.Id;
    return this.http.delete(`${this.api.get('exceptionComissionBrand')}/DeleteComsnExc/` + param);
    // return this.http.delete<any>(this.api.get('deleteComission', param));

  }
}
