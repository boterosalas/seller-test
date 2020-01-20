import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CitiesEntity } from '@app/shared';


@Injectable()
export class CitiesServices {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) {
  }

  /**
   * @method fetchData
   * @description Método para consumir el servicio de ciudades
   * @returns {Observable<{}>}
   * @memberof CitiesServices
   */
  fetchData(paramValue: {}): Observable<{}> {
    return new Observable(observer => {
      this.http.get<any>(this.api.get('getCities', [paramValue]), { observe: 'response' })
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

  public getCities(idState: number): Observable<CitiesEntity[]> {
    return this.http.get<CitiesEntity[]>(this.api.get('getCities', [idState]))
      .pipe(map((res: any) => <CitiesEntity[]>JSON.parse(res.body).Data));
  }

  public getCitiesCoverage(): Observable<CitiesEntity[]> {
    return this.http.get<CitiesEntity[]>(this.api.get('getCitiesCoverage'))
      .pipe(map((res: any) => <CitiesEntity[]>JSON.parse(res.body).Data));
  }
}
