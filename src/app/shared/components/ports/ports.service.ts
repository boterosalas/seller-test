import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PortEntity } from '@app/shared';


@Injectable()
export class PortsService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * @method getPortByCountryName
   * @description Método para consumir el servicio de puertos por países
   * @param countryName Nombre del pais seleccionado
   * @returns {Observable<PortEntity[]>}
   * @memberof PortsServices
   */
  public getPortByCountryName(countryName: string): Observable<PortEntity[]> {
    return this.http.get<any>(this.api.get('getPortsByCountryName', [countryName]))
      .pipe(map((res: any) => <PortEntity[]>JSON.parse(res.body).Data));
  }
}
