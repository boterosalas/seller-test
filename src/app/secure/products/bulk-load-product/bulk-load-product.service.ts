import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';


@Injectable()
export class BulkLoadProductService {
  public httpOptions: any;
  public idToken: any;
  public headers: any;
  public currentDate: any;
  public seller: any;
  public profileTypeGlobal: string;
  constructor(
    private http: HttpClient,
    private api: EndpointService,
  ) {
    this.currentDate = this.getDate();
    this.getTypeUser();
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

  // Obtiene el tipo de perfil
  public getTypeUser(): void {
    if (!this.profileTypeGlobal) {
      this.http.get(this.api.get('getPermissions')).subscribe((result: any) => {
        if (result.body) {
          const data = JSON.parse(result.body);
          if (data.Data && data.Data.Profile) {
            const profileTye = data.Data.Profile.ProfileType;
            this.profileTypeGlobal = profileTye;
          }
        }
      }, error => {
        this.profileTypeGlobal = null;
        console.error(error);
      });
    }
  }

  /**
   * Método para cerrar sesión.
   *
   * @returns {Observable<{}>}
   * @memberof BulkLoadProductService
   */
  setProducts(params: {}): Observable<{}> {
    /* Tienda (Vendedores) Raramente la clase constantes crea una dependencia circular
    por ello se compara directamente con el tipo de perfil*/
    return new Observable(observer => {
      this.http.patch<any>(this.api.get('postSaveInformationUnitCreation'), params, { observe: 'response' })
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

  setProductsModeration(params: {}): Observable<{}> {
    /* Tienda (Vendedores) Raramente la clase constantes crea una dependencia circular
    por ello se compara directamente con el tipo de perfil*/
    return new Observable(observer => {
      this.http.post<any>(this.api.get('postSaveInformationModerationSeller'), params, { observe: 'response' })
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
      this.http.get<any>(this.api.get('products', [this.currentDate]), { observe: 'response' })
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
   * Método para obtener las categorias de vetex
   * @param {*} categoria
   * @returns {Observable<any>}
   * @memberof BulkLoadProductService
   */
  getCategoriesVTEX(categoria: any): Observable<any> {
    return this.http.get(this.api.get('getCategoriesVetex') + categoria);
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
            observer.next(data);
          },
          error => {
            observer.next(error);
          }
        );
    });
  }

  /**
   * Endpoint para obtener el arbol de categoria de VTEX
   * @returns {Observable<{}>}
   * @memberof BulkLoadProductService
   */
  getVtexTree(): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getVtexTree'), { observe: 'response' })
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
