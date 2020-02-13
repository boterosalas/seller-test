import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';
import { ModelFilterProducts } from './listFilter/filter-products.model';
import { EventEmitter } from '@angular/core';


@Injectable()
export class ListProductService {
  public headers: any;
  public paramsData: ModelFilterProducts;
  @Output() change: EventEmitter<boolean> = new EventEmitter();


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
    this.paramsData = new ModelFilterProducts();
  }

  /**
   * Volver
   *
   * @memberof ListProductService
   */
  public changeEmitter(): void {
    this.change.emit(false); // Todo el que este subscrito a esta variable va a obtener el cambio de la misma
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
    this.paramsData.pluVtex = params === undefined || params.pluVtex === undefined || params.pluVtex === null;

    urlParams = this.paramsData.initialDate + '/' + this.paramsData.finalDate + '/' + this.paramsData.ean + '/' + this.paramsData.productName + '/' + this.paramsData.creationDate + '/' + this.paramsData.page + '/' + this.paramsData.limit  + '/'  + this.paramsData.pluVtex;

    return this.http.get(this.api.get('getProductList', urlParams));
  }



  /*
  * Funcion para obtener informacion del producto expandido.
  */
  public getListProductsExpanded(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get('getProductExpanded', [params]));
  }

  public getProductsDetails(params?: any): Observable<{}> {
    return this.http.get(this.api.get('getProductDetails', [params]));
  }


}
