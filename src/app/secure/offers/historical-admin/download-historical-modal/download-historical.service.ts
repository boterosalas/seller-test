// 3rd party components
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

// our own custom components
import { EndpointService } from '@app/core';

@Injectable()
export class DownloadHistoricalService {

  // Variable para almacenar la fecha de inicio del filtro
  public dateInitial: string;

  // Variable para almacenar la fecha de fin del filtro
  public dateFinal: string;

  // Variable para almacenar el EAN del filtro
  public ean: string;

  // Variable para almacenar la id del seller
  public idSeller: string;

  constructor(
    private http: HttpClient,
    private api: EndpointService,
    private datePipe: DatePipe
  ) { }

  /**
   * @method getCurrentFilterHistorical
   * @description Método para obtener el filtro actual que el usuario ha aplicado a la consulta de órdenes
   * @memberof DownloadHistoricalService
   */
  getCurrentFilterHistorical() {
    const currentFilterHistorical = JSON.parse(localStorage.getItem('currentFilterHistorical'));
    return currentFilterHistorical || {};
  }

  /**
   * @method setCurrentFilterHistorical
   * @description Metodo para setear el filtro actual que el usuario ha aplicado a las órdenes que esta visualizando
   * @param dateInitial
   * @param dateFinal
   * @param ean
   * @memberof DownloadHistoricalService
   */
  setCurrentFilterHistorical(dateInitial: string, dateFinal: string, ean: string, idSeller: string) {
    const objParamsFilter = {
      dateInitial,
      dateFinal,
      ean,
      idSeller
    };
    localStorage.setItem('currentFilterHistorical', JSON.stringify(objParamsFilter));
  }

  /**
   * @method downloadHistorical
   * @description Método para realizar el consumo del servicio que permite enviar las órdenes al correo electronico del usuario
   * @param {any} stringSearch
   * @returns {Observable<[{}]>}
   * @memberof DownloadHistoricalService
   */
  downloadHistorical(email: string): Observable<[{}]> {
    const paramsFilter = this.getCurrentFilterHistorical();

    let urlFilterParams: any;

    // Valida los datos antes de enviar la petición
    this.dateInitial = paramsFilter.dateInitial === undefined ? null : this.datePipe.transform(paramsFilter.dateInitial, 'yyyy-MM-dd');
    this.dateFinal = paramsFilter.dateFinal === undefined ? null : this.datePipe.transform(paramsFilter.dateFinal, 'yyyy-MM-dd');
    this.ean = paramsFilter.ean === undefined || paramsFilter.ean === '' ? null : paramsFilter.ean;
    this.idSeller = paramsFilter.idSeller === undefined || paramsFilter.idSeller === '' ? null : paramsFilter.idSeller;

    // Arma la ulr con los datos de la petición
    urlFilterParams = this.idSeller + '/' + this.dateInitial + '/' + this.dateFinal + '/' + this.ean + '/' + email;
    return new Observable(observer => {
      this.http.get<any>(this.api.get('downloadHistoricalAdmin', [urlFilterParams]), { observe: 'response' })
        .subscribe((data: any) => {
          observer.next(data);
        }, err => {
          observer.error(err);
        });
    });
  }

}
