import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CognitoUtil, EndpointService } from '@app/core';
import { defaultVersion, endpoints } from '@root/api-endpoints';
import { Observable } from 'rxjs';


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
  ) {
    this.currentDate = this.getDate();
  }

  /**
   * @method getDate()
   * @returns {*}
   * @description Metodo para obtener la fecha actual
   * @memberof BulkLoadProductService
   */
  private getDate(): any {
    let today: any = new Date();
    let dd: any = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }

  /**
   * Método para cerrar sesión.
   *
   * @returns {Observable<{}>}
   * @memberof BulkLoadProductService
   */
  setProducts(params: {}): Observable<{}> {
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('products'), params, { observe: 'response' })
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

  /**
   * @method getAmountAvailableLoads()
   * @returns {Observable}
   * @description Método para obtener el número de cargas que aun se pueden hacer
   * @memberof BulkLoadProductService
   */
  getAmountAvailableLoads(): Observable<{}> {
    // tslint:disable-next-line:prefer-const
    let params: any;
    // params = params.append('date', this.currentDate);

    return new Observable(observer => {
      this.http.get<any>(this.api.get('products', [this.currentDate]), { observe: 'response' } )
        .subscribe(
          data => {
            console.log('data', data);
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

  /**
   * @method getCargasMasicas()
   * @returns {Observable}
   * @description Método para obtener mirar el estado de las cargas
   */

  getCargasMasivas(): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getStateOfCharge'), { observe: 'response' })
      .subscribe(
        data => {
          console.log('data', data);
          observer.next(data);
        },
        error => {
          console.log('error', error);
          observer.next(error);
        }
      );
    });
  }

}
