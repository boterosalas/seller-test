import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { String } from 'aws-sdk/clients/rdsdataservice';

export interface BrandModel {
  IdBrand: number;
  NameBrand: string;
}

export interface Brands {
  id: number;
  name: string;
  status: boolean;
  paginationToken: string;
}


@Injectable()
export class BrandService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  getAllBrands(params: any): Observable<any> {
    return this.http.get(this.api.get('getAllBrands', [params]));
  }

  changeStatusBrands(body: any): Observable<any> {
    return this.http.patch(this.api.get('updateBrand'), body);
  }

  createBrands(body: any): Observable <any> {
    return this.http.patch(this.api.get('createBrand'), body);
  }

  validateExistBrands(params: any): Observable<any> {
    return this.http.get(this.api.get('validateBrandsExact', [params]));
  }

  /**
   * Metodo para crear cargas masivas de marcas
   * @param {*} data
   * @returns
   * @memberof BrandService
   */
  createMassiceBrands(data: any) {
    return this.http.post(this.api.get('createMassiveBrand'), data);
  }

  /**
   * Metodo para consultar el estado de las cargas masivas por marcas
   * @param {*} data
   * @returns
   * @memberof BrandService
   */
  statusMassiceBrands() {
    return this.http.get(this.api.get('getStatusMassiveBrand'), { observe: 'response' });
  }

}
