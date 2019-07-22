// 3rd party components
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// our own custom components
import { EndpointService } from '@app/core';
import { ModelFilter } from './components/filter/filter.model';

@Injectable({
  providedIn: 'root'
})
export class ListAdminService {

   // Variable para almacenar los parametros que se le enviaran al servicio
   public paramsData: ModelFilter;

   // Variable para almancenar los paginationTokens
   public paginationTokens: Array<string>;
 
   /**
    * Create instances of ListAdminService
    * @param {http} HttpClient
    * @param {endpointService} EndpointService
    */
   constructor(
     private http: HttpClient,
     private api: EndpointService,
     private datePipe: DatePipe
   ) {
     this.paramsData = new ModelFilter();
   }
 
   /**
    * @method savePaginationTokens
    * @param pagTokens
    * @description Metodo para almacenar los paginationTokens, necesarios para las peticiones
    *              al servicio mediante el paginador
    * @memberof ListAdminService
    */
   public savePaginationTokens(pagTokens: Array<string>) {
     this.paginationTokens = pagTokens;
   }
 
   /**
    * @method getListAdminOffers
    * @description Metodo para obtener el histórico de ofertas
    * @returns {Observable<{}>}
    * @memberof ListAdminService
    */
   public getListAdminOffers(params?: any): Observable<{}> {
      // Se crea variable que guardara los parámetros unidos para enviarle al servicio.
      let urlParams: any;
  
      this.paramsData.ean = params === undefined || params.ean === undefined || params.ean === null || params.ean === '' ? null : params.ean;
      this.paramsData.product = params === undefined || params.product === undefined || params.product === null || params.product === '' ? null : params.product.replace(/\ /g, '+');
      // this.paramsData.stock = params === undefined || params.stock === undefined || params.stock === null || params.stock === '' ? null : params.stock;
      this.paramsData.IdSeller = params.IdSeller;
      this.paramsData.currentPage = params === undefined || params.currentPage === undefined || params.currentPage === null || params.currentPage === '' ? null : params.currentPage - 1;
      this.paramsData.limit = params === undefined || params.limit === undefined || params.limit === null || params.limit === '' ? null : params.limit;
  
      urlParams = + this.paramsData.IdSeller + '/' + this.paramsData.ean + '/' + this.paramsData.product + '/' + this.paramsData.currentPage + '/' + this.paramsData.limit;
  
      return new Observable(observer => {
        this.http.get<any>(this.api.get('getOffers', [urlParams]), { observe: 'response' })
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
