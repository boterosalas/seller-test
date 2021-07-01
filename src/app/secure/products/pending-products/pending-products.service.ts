import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { EndpointService } from '@app/core';
import { Order } from '@app/shared';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';





@Injectable()
/**
 * Clase OrderService
 */
export class PendingProductsService {

  @Output() change: EventEmitter<boolean> = new EventEmitter();






 public productData= {
    "viewModel": [
        {
            "CurrentProduct": "{\"Name\":\"Prueba Channel Esteban Muchos Cambios\",\"Category\":\"27875\",\"Brand\":\"GEF\",\"Description\":\"Canal Jeans&#160;Esteban Muchos Cambios\",\"KeyWords\":\"canal,vaqueros,Muchos cambios\",\"SkuShippingSize\":\"3\",\"PackageWidth\":\"22\",\"PackageHeight\":\"14\",\"PackageLength\":\"35\",\"PackageWeight\":\"2\",\"ProductWidth\":\"22,0\",\"ProductHeight\":\"14,0\",\"ProductLength\":\"35,0\",\"ProductWeight\":\"2,0\",\"ImageUrl1\":\"https://exitocol.vtexassets.com/arquivos/ids/7537647-800-auto.jpg\",\"ImageUrl2\":\"https://images-na.ssl-images-amazon.com/images/I/71%2BwUShoaiL._AC_UX385_.jpg\",\"Features\":[{\"Key\":\"Largo de la Manga\",\"Value\":\"Manga 3/4\",\"Id\":\"\",\"IdVtexCarulla\":\"\"},{\"Key\":\"Silueta\",\"Value\":\"Ajustada\",\"Id\":\"\",\"IdVtexCarulla\":\"\"}],\"ConversionFactor\":\"2,0\",\"VideoUrl\":\"https://www.youtube.com/embed/HOnE3IgVkY8\",\"SonReference\":\"IZ20000074347\"}",
            "Ean": "IZ20000074347",
            "Id": 637606489195111653,
            "OldProduct": "{\"Name\":\"Prueba Channel\",\"Category\":\"28254\",\"Brand\":\"ADIDAS\",\"Description\":\"Canal Jeans\",\"KeyWords\":\"canal,vaqueros\",\"SkuShippingSize\":\"2\",\"PackageWidth\":\"21\",\"PackageHeight\":\"13\",\"PackageLength\":\"34\",\"PackageWeight\":\"1\",\"ProductWidth\":\"21,0\",\"ProductHeight\":\"13,0\",\"ProductLength\":\"34,0\",\"ProductWeight\":\"1,0\",\"ImageUrl1\":\"https://images-na.ssl-images-amazon.com/images/I/71%2BwUShoaiL._AC_UX385_.jpg\",\"ImageUrl2\":\"https://images-na.ssl-images-amazon.com/images/I/71%2BwUShoaiL._AC_UX385_.jpg\",\"Features\":[{\"Key\":\"Largo de la Manga\",\"Value\":\"Manga 3/4\",\"Id\":\"\",\"IdVtexCarulla\":\"\"},{\"Key\":\"Silueta\",\"Value\":\"Ajustada\",\"Id\":\"\",\"IdVtexCarulla\":\"\"}],\"ConversionFactor\":\"1,0\",\"VideoUrl\":\"https://www.youtube.com/embed/HOnE3IgVkY8\",\"SonReference\":\"\"}",
            "SellerId": 100241,
            "Status": 1,
            "ImageUrl1": "https://www.wallpapertip.com/wmimgs/17-178031_de-gournay-hampton-court.jpg",
            "CreationDate": "2021-06-30",
            "UpdateDate": null,
            "Name": "Prueba Channel Esteban Muchos Cambios"
        }
    ],
    "count": 5,
    "paginationToken": "{}",
    "paginationTokens": []
};

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }



  public changeEmitter(): void {
    this.change.emit(false); // Todo el que este subscrito a esta variable va a obtener el cambio de la misma
  }

  /**
   * Método para realiar la consulta de los productos pendientes por modificación.
   * @param {any} state
   * @param {User} user
   * @param {any} limit
   * @returns {Observable<[{}]>}
   * @memberof OrderService
   */
  getPendingProductsModify(params: any): Observable<[{}]> {
    const filter = '';
    return new Observable(observer => {
      this.http.get<Order[]>(this.api.get('getProductsPendingModify', [params.idSeller, params.limit + filter])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }

  /**
   * Método para realiar la consulta de los productos pendientes por validación.
   * @param {*} params
   * @returns {Observable<[{}]>}
   * @memberof PendingProductsService
   */
  getPendingProductsValidation(params: any): Observable<[{}]> {
    const filter = '';
    return new Observable(observer => {
      this.http.get<Order[]>(this.api.get('getProductsPendingValidation', [params.idSeller, params.limit + filter])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }
  /**
   * Método para realiar la consulta de los productos pendientes por validación.
   * @param {*} params
   * @returns {Observable<[{}]>}
   * @memberof PendingProductsService
   */
  getAllProductPendingMultiOfert(params: any): Observable<any> {
    // return new Observable(observer => {
    //   this.http.get<Order[]>(this.api.get('getAllproductsApproveBySeller', [params])).subscribe((data: any) => {
    //     observer.next(data);
    //   }, err => {
    //     observer.error(err);
    //   });
    // });
    return new Observable(observer => {
      observer.next(this.productData);
    });
  }

  /**
   * Obtener información al detalle del producto por EAN productos en modificacion
   * @param {*} params
   * @returns {Observable<[{}]>}
   * @memberof PendingProductsService
   */
  getEANProductsModify(params?: any): Observable<{}> {
    // return this.http.get(this.api.get('getProductList', [params]));
    return this.http.get(this.api.get('getEANPendingModify', [params]));
  }

  /**
   * Obtener información al detalle del producto por EAN para productos en validación
   * @param {*} [params]
   * @returns {Observable<{}>}
   * @memberof PendingProductsService
   */
  getEANProductsValidation(params?: any): Observable<{}> {
    return this.http.get(this.api.get('getEANPendingValidation', [params]));
  }


  sendApprovedProductMultiOfert(params?: any): Observable<{}> {
    return new Observable(observer => {
      observer.next({true: true});
    });
  }

  sendRejectProductProductMultiOfert(params?: any): Observable<{}> {
    return new Observable(observer => {
      observer.next({true: true});
    });
  }


}
