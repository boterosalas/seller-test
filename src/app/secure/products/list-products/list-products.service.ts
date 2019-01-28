import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { defaultVersion, endpoints } from '@root/api-endpoints';
import { Observable, of } from 'rxjs';


@Injectable()
export class BulkLoadProductService {
  public httpOptions: any;
  public idToken: any;
  public headers: any;
  public currentDate: any;

  constructor(
    private http: HttpClient,
    public cognitoUtil: CognitoUtil,
    private api: EndpointService
  ) { }

  /**
   * @method getDate()
   * @returns {*}
   * @description Metodo para obtener la fecha actual
   * @memberof BulkLoadProductService
   */

  getCargasMasivas(): Observable<{}> {
    return of(
      {
        body: {
          'errors': [],
          'data': {
            'ean': 123456789,
            'name': 'Huawei P20 lite Dual Sim 64GB',
            'fechacerate': '22/08/2018',
            'fechamodify': '22/08/2018',
            'bestprice': 1001001
          },
          'message': 'Operación realizada éxitosamente.'
        }
      }
    );
  }

}
