import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Billing } from '@app/shared';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable()
export class BillingService {

   // Variable para almacenar la fecha de inicio del filtro
   public dateInitial: string;

   // Variable para almacenar la fecha de fin del filtro
   public dateFinal: string;
 
   // Variable para almacenar el bill del filtro
   public bill: string;

  constructor(
    private http: HttpClient,
    private api: EndpointService,
    private datePipe: DatePipe
  ) { }

  /**
   * Método para realiar la consulta de las transportadoras.
   *
   * @param {any} stringSearch
   * @returns {Observable<Billing[]>}
   * @memberof BillingService
   */
  getBilling(user, stringSearch): Observable<Billing[]> {
    return new Observable(observer => {
      this.http.get(this.api.get('getBilling', [stringSearch])).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        observer.error(error);
      });
    });
  }

  /**
   * Método para realiar la consulta de las órdenes de acuerdo a los filtros indicados.
   *
   * @param {User} user
   * @param {any} limit
   * @param {any} stringSearch
   * @returns {Observable<Billing[]>}
   * @memberof BillingService
   */
  getOrdersBillingFilter(user: any, limit, stringSearch): Observable<Billing[]> {
    return new Observable(observer => {
      // Id del vendedor.
      const sellerId = user.sellerId;

      this.http.get<Billing[]>(this.api.get('searchBilling', [sellerId, limit + stringSearch])).subscribe((data) => {
        observer.next(data);
      }, errorMessage => {
        observer.error(errorMessage);
      });
    });
  }


  /**
   * Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes.
   *
   * @returns
   * @memberof BillingService
   */
  getCurrentFilterOrders() {
    const currentFilter = JSON.parse(localStorage.getItem('currentFilter'));
    return currentFilter || {};
  }

  /**
   * Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando.
   *
   * @param {any} data
   * @memberof BillingService
   */
  setCurrentFilterOrders(data) {
    localStorage.setItem('currentFilter', JSON.stringify(data));
  }

  /**
   * @method getCurrentFilterPays
   * @description Método para obtener el filtro actual que el usuario ha aplicado a la consulta de pagos
   * @memberof DownloadBillingPayService
   */
  getCurrentFilterPay() {
    const currentFilterBillingPay = JSON.parse(localStorage.getItem('currentFilterBillingPay'));
    return currentFilterBillingPay|| {};
  }

  /**
   * @method setCurrentFilterBillingPay
   * @description Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
   * @param dateInitial
   * @param dateFinal
   * @param bill
   * @memberof DownloadBillingPayService
   */
  setCurrentBillingPay(dateInitial: string, dateFinal: string, bill: string) {
    const objParamsFilter = {
      dateInitial,
      dateFinal,
      bill
    };
    localStorage.setItem('currentFilterBillingPay', JSON.stringify(objParamsFilter));
  }

    downloadBillingPay(email: string): Observable<[{}]> {
    const paramsFilter = this.getCurrentFilterPay();

    let urlFilterParams: any;

    // Valida los datos antes de enviar la petición
    this.dateInitial = paramsFilter.dateInitial === undefined ? null : this.datePipe.transform(paramsFilter.dateInitial, 'yyyy-MM-dd');
    this.dateFinal = paramsFilter.dateFinal === undefined ? null : this.datePipe.transform(paramsFilter.dateFinal, 'yyyy-MM-dd');
    this.bill = paramsFilter.bill === undefined || paramsFilter.bill === '' ? null : paramsFilter.bill;

    // Arma la ulr con los datos de la petición
    urlFilterParams = this.dateInitial + '/' + this.dateFinal + '/' + this.bill + '/' + email;

    return new Observable(observer => {
      this.http.get<any>(this.api.get('postBillingOrders', [urlFilterParams]), { observe: 'response'})
      .subscribe((data: any) => {
        observer.next(data);
      }, err => {
          observer.error(err);
      });
    });
  }
  
}
