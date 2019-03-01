import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { defaultVersion, endpoints } from '@root/api-endpoints';
import { Observable, of } from 'rxjs';
import { ModelFilterProducts } from './listFilter/filter-products.model';


@Injectable()
export class ListProductService {
  public headers: any;
  public paramsData: ModelFilterProducts;


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.paramsData = new ModelFilterProducts();
  }

  /**
   * Servicio que obtiene el listado de productos
   *
   * @param {*} [params]
   * @returns {Observable<{}>}
   * @memberof ListProductService
   */
  public getListProducts(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get('getProductList', [params]));
  }

  public getListProductsFilter(params?: any): Observable<{}> {
    let urlParams: any;

    this.paramsData.ean = params === undefined || params.ean === undefined || params.ean === null || params.ean === '' ? null : params.ean;
    this.paramsData.productName = params === undefined || params.productName === undefined || params.productName === null;
    this.paramsData.creationDate = params === undefined || params.creationDate === undefined || params.creationDate === null;
    this.paramsData.initialDate = params === undefined || params.initialDate === undefined || params.initialDate === null;
    this.paramsData.finalDate = params === undefined || params.finalDate === undefined || params.finalDate === null;
    this.paramsData.page = params === undefined || params.page === undefined || params.page === null;
    this.paramsData.limit = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;

    urlParams = this.paramsData.initialDate + '/' + this.paramsData.finalDate + '/' + this.paramsData.ean + '/' + this.paramsData.productName + '/' + this.paramsData.creationDate + '/' + this.paramsData.page + '/' + this.paramsData.limit;

    return this.http.get(this.api.get('getProductList', urlParams));
  }



  /*
  * Funcion para obtener informacion del producto expandido.
  */
  public getListProductsExpanded(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get('getProductExpanded', [params]));
  }


}
