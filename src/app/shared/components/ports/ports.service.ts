import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PortEntity } from '@app/shared';
import { ports } from "./ports";


@Injectable()
export class PortsService {

  listPorts = ports;
  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * @method fetchData
   * @description Método para consumir el servicio de puertos por ciudades
   * @returns {Observable<{}>}
   * @memberof PortsServices
   */
  fetchData(paramValue?: {}): any {
    // return new Observable(observer => {
    //   this.http.get<any>(this.api.get('getPorts', [paramValue]), { observe: 'response' })
    //     .subscribe(
    //       data => {
    //         observer.next(data);
    //       },
    //       error => {
    //         observer.next(error);
    //       }
    //     );
    // });
    return of(this.listPorts);
  }

  public getPortByCountryName(countryName: string): Observable<PortEntity[]> {
    return this.http.get<any>(this.api.get('getPortsByCountryName', [countryName]))
      .pipe(map((res: any) => <PortEntity[]>JSON.parse(res.body).Data));
  }

  // public getCitiesCoverage(): Observable<CitiesEntity[]> {
  //   return this.http.get<CitiesEntity[]>(this.api.get('getCitiesCoverage'))
  //     .pipe(map((res: any) => <CitiesEntity[]>JSON.parse(res.body).Data));
  // }
}
