import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolExitoService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  getAllModuleSchoolExito(params: any): Observable<any> {
    return this.http.get(this.api.get('getAllModuleSchoolExito', [params]));
  }
}
