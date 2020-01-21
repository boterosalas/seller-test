import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';

// const dataMock = this.api.get('getDaneCodesNonCoverage');

@Injectable()
export class CitiesCoverageService {
  constructor(
    private api: EndpointService,
    private http: HttpClient,
  ) { }

  /**
   * Service que se trae los codigos dane de no covered
   * @returns {Observable<{}>}
   * @memberof CitiesCoverageService
   */
  public getDaneCodesNonCoverage(): Observable<{}> {
    // return of(dataMock).pipe(map(item => item.DaneCodesNonCoverage));
    return this.http.get(this.api.get('getDaneCodesNonCoverage'));

  }

  /**
   * Servicio patch para guardar los codigos dane de no covered
   * @param {*} params
   * @returns {Observable<{}>}
   * @memberof CitiesCoverageService
   */
  public pacthCitiesNoCoverage(params: any): Observable<{}> {
    return this.http.patch(this.api.get('pacthCitiesNoCoverage'), params, { observe: 'response' });

  }
}
