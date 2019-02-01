
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';



@Injectable()
export class ParamSpecsService {


  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  public getSpecifications(): Observable<any> {
    return this.http.get(this.api.get('getProductSpecs'), { observe: 'response' });
  }

  public getSpecification(id: number): Observable<{}> {
    return this.http.get(this.api.get('getProductSpecs', [id]), { observe: 'response' });
  }

  public addSpecification(model: any): Observable<any> {
    return of({
      status: 200,
      body: true
    });
    // this.http.patch(this.api.get('getProductSpecs'), model);
  }

  public updateSpecification(model: any): Observable<any> {
    return of({
      status: 200,
      body: true
    });
    // return this.http.post(this.api.get('getProductSpecs'), model);
  }

  /**
   * ELiminar grupo de especificacion
   *
   * @param {*} model
   * @returns {Observable<any>}
   * @memberof ParamSpecsService
   */
  public deleteGroupSpecification(model: any): Observable<any> {
    return of({
      status: 200,
      body: true
    });
    // this.http.patch(this.api.get('getProductSpecs'), model);
  }

  /**
   * Eliminar especificacion
   *
   * @param {number} id
   * @returns {Observable<{}>}
   * @memberof ParamSpecsService
   */
  public deleteSpecification(id: number): Observable<{}> {
    return this.http.delete(this.api.get('getProductSpecs', [id]), { observe: 'response' });
  }

}
