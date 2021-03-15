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
/**
 * funcion para consultar todos los modulos
 *
 * @param {*} params
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
getAllModuleSchoolExito(params: any): Observable<any> {
    return this.http.get(this.api.get('getAllModuleSchoolExito', [params]));
  }
/**
 * funcion para editar los modulos
 *
 * @param {*} body
 * @returns {Observable<{}>}
 * @memberof SchoolExitoService
 */
editModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get('editModules'), body);
  }
/**
 * funcion para crear submodulos
 *
 * @param {*} param
 * @param {*} body
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
public createSubModules(param: any, body: any): Observable<any> {
    return this.http.post(this.api.get('createSubModules', [param]), body);
  }
/**
 * funcion para crear modulos
 *
 * @param {*} body
 * @returns {Observable<{}>}
 * @memberof SchoolExitoService
 */
createModules(body: any): Observable<{}> {
    return this.http.post(this.api.get('createModules'), body);
  }
/**
 * funcion para editar submodulos
 *
 * @param {*} body
 * @returns {Observable<{}>}
 * @memberof SchoolExitoService
 */
editSubModules(body: any): Observable<{}> {
    return this.http.patch(this.api.get('editSubModules'), body);
  }
/**
 * funcion para mover los submodulos
 *
 * @param {*} body
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
updatePositionSubModules(body: any): Observable<any> {
    return this.http.patch(this.api.get('updatePositionSubModules'), body);
  }
/**
 * funcion para mover los modulos
 *
 * @param {*} body
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
updatePositionModules(body: any): Observable<any> {
    return this.http.patch(this.api.get('updatePositionModules'), body);
  }
/**
 * funcion para eliminar modulos
 *
 * @param {*} param
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
public deleteModule(param: any): Observable<any> {
    return this.http.delete(this.api.get('deleteModules', [param]), { observe: 'response' });
  }
/**
 * funcion para eliminar submodulos
 *
 * @param {*} moduleId
 * @param {*} subModuleId
 * @returns {Observable<any>}
 * @memberof SchoolExitoService
 */
public deleteSubModule(moduleId: any, subModuleId: any): Observable<any> {
    return this.http.delete(this.api.get('deleteSubModules', [moduleId, subModuleId]), { observe: 'response' });
  }


public validateCreateMassive(): Observable<any> {
    return this.http.get(this.api.get('ValidateCreateMassive'));
  }
}
