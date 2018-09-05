/* 3rd party components */
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

/* our own custom components */
import { endpoints, defaultVersion } from '../../../../../../api-endpoints';
import { BaseSellerService } from '@app/shared';

@Injectable()
/**
 * Clase DownloadHistoricalService
 */
export class DownloadHistoricalService extends BaseSellerService {

  /*Variable para almacenar el endpoint que se va a consumir*/
  public endpoint = endpoints[defaultVersion.prefix + defaultVersion.number]['downloadHistorical'];

  // Variable para almacenar la fecha de inicio del filtro
  public dateInitial: Date;

  // Variable para almacenar la fecha de fin del filtro
  public dateFinal: Date;

  // Variable para almacenar el EAN del filtro
  public ean: string;

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
  setCurrentFilterHistorical(dateInitial, dateFinal, ean) {
    const objParamsFilter = {
      dateInitial,
      dateFinal,
      ean
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
  downloadHistorical(email): Observable<[{}]> {
    const paramsFilter = this.getCurrentFilterHistorical();

    let urlFilterParams: any;

    // Valida los datos antes de enviar la petición
    this.dateInitial = paramsFilter.dateInitial === undefined ? null : paramsFilter.dateInitial;
    this.dateFinal = paramsFilter.dateFinal === undefined ? null : paramsFilter.dateFinal;
    this.ean = paramsFilter.ean === undefined || paramsFilter.ean === '' ? null : paramsFilter.ean;

    urlFilterParams = '/' + email + '/' + this.dateInitial + '/' + this.dateFinal + '/' + this.ean;
    const idToken = this.cognitoUtil.getTokenLocalStorage();
    const headers = new HttpHeaders({ 'Authorization': idToken, 'Content-type': 'application/json; charset=utf-8' });

    this.changeEndPoint();

    return new Observable(observer => {
      this.http.post(this.endpoint + urlFilterParams, { observe: 'response', headers: headers })
      .subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }
}
