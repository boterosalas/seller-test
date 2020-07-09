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
    let filter = '';
    // if (params) {
    //   if ( params.dateOrderInitial && params.dateOrderInitial !== '') {
    //     filter += `&dateOrderInitial=${params.dateOrderInitial}`;
    //   }
    //   if (params.dateOrderFinal && params.dateOrderFinal !== '') {
    //     filter += `&dateOrderFinal=${params.dateOrderFinal}`;
    //   }
    //   if (params.idChannel && params.idChannel !== '') {
    //     filter += `&idChannel=${params.idChannel}`;
    //   }

    //   if (params.orderNumber && params.orderNumber !== '') {
    //     filter += `&orderNumber=${params.orderNumber}`;
    //   }
    //   if (params.identificationCard && params.identificationCard !== '') {
    //     filter += `&identificationCard=${params.identificationCard}`;
    //   }
    //   if (params.processedOrder && params.processedOrder !== '') {
    //     filter += `&processedOrder=${params.processedOrder}`;
    //   }
    // }
    return new Observable(observer => {
      this.http.get<Order[]>(this.api.get('getProductsPendingModify', [params.idSeller, params.limit + filter ])).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        observer.error(err);
      });
    });
  }
}