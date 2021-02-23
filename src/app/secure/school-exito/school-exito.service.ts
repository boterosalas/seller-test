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

  editModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get('editModules'), body);
  }

  public createSubModules(param: any, body: any): Observable<any> {
    return this.http.post(this.api.get('createSubModules', [param]), body);
  }

  createModules(body: any): Observable<{}> {
    return this.http.post(this.api.get("createModules"), body);
  }

  editSubModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get("editSubModules"), body);
  }

  public deleteModule(param: any): Observable<any> {
    return this.http.delete(this.api.get('deleteModules', [param]), { observe: 'response' });
  }

  public deleteSubModule(moduleId: any, subModuleId: any): Observable<any> {
    return this.http.delete(this.api.get('deleteSubModules', [moduleId, subModuleId]), { observe: 'response' });
  }

}
