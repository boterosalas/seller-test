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

  /**
  * Servicio para modificar los modulos
  *
  * @returns {Observable<{}>}
  * @memberof SchoolExitoService
  */
  editModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get("editModules"), body);
  }


  /**
  * Servicio para crear los modulos
  * @param {*} param nombre del modulo
  * @returns {Observable<any>}
  * @memberof SchoolExitoService
  */
  public createSubModules(param: any, body: any): Observable<any> {
    return this.http.post(this.api.get('createSubModules', [param]), body);
  }

  /**
 * Servicio para modificar los submodulos
 *
 * @returns {Observable<{}>}
 * @memberof SchoolExitoService
 */
  createModules(body: any): Observable<{}> {
    return this.http.post(this.api.get("createModules"), body);
  }

  /**
 * Servicio para modificar los submodulos
 *
 * @returns {Observable<{}>}
 * @memberof SchoolExitoService
 */
  editSubModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get("editSubModules"), body);
  }

  /**
  * Servicio para eliminar los modulos
  * @param {*} param Id del modulo
  * @returns {Observable<any>}
  * @memberof SchoolExitoService
  */
  public deleteModule(param: any): Observable<any> {
    return this.http.delete(this.api.get('deleteModules', [param]), { observe: 'response' });
  }

  /**
  * Servicio para eliminar los submodulos
  * @param {*} moduleId Id del modulo
  * @param {*} subModuleId Id del submodulo
  * @returns {Observable<any>}
  * @memberof SchoolExitoService
  */
  public deleteSubModule(moduleId: any, subModuleId: any): Observable<any> {
    return this.http.delete(this.api.get('deleteSubModules', [moduleId, subModuleId]), { observe: 'response' });
  }

}
