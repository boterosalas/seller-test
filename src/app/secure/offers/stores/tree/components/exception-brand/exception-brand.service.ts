import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
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

  constructor(private api: EndpointService, private http: HttpClient) { }

  /**
   * Serivio que crea las excepciones de marcas
   * @param {*} body
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public createExceptionBrand(body: any): Observable<{}> {
    return this.http.patch<any>(this.api.get('exceptionBrand'), [body]);
  }

  /**
   * Serivio que obtiene las excepciones de marcas
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public getExceptionBrandComision(): Observable<{}> {
    return of(this.data);
    // return this.http.get(this.api.get('transports'), { observe: 'response' });
  }

  /**
   * Serivio que actualiza las excepciones de marcas
   * @param {*} body
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public updateExceptionBrand(body: any): Observable<{}> {
    return this.http.post(this.api.get('transports'), [body]);
  }

  /**
   * Serivio que elimina las excepciones de marcas
   * @param {number} idBrand
   * @returns {Observable<{}>}
   * @memberof ExceptionBrandService
   */
  public deleteExceptionBrand(idBrand: number): Observable<{}> {
    return this.http.delete<any>(this.api.get('getTransport', [idBrand]));
  }
}
