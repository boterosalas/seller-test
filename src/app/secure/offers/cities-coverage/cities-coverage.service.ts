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

  public getDaneCodesNonCoverage(): Observable<{}> {
    // return of(dataMock).pipe(map(item => item.DaneCodesNonCoverage));
    return this.http.get(this.api.get('getDaneCodesNonCoverage'));

  }
}
