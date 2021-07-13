import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryTreeService {

  delay = 5000;
  stop = false;
  i = 0;

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }
  /**
   * funcion para capturar todo el arbol de categorias
   *
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  getCategoryTree(): Observable<any> {
    return this.http.get(`${this.api.get('manageCategory')}/GetAllCategories`, { observe: 'response' });
  }
  /**
   * funcion para crear un categoria
   *
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  createCategory(body: any): Observable<any> {
   return this.http.post(`${this.api.get('manageCategory')}/AddCategory`, body);
  }
  /**
   * funcion para editar una categoria
   *
   * @param {*} body
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  updateCategory(body: any): Observable<any> {
    return this.http.patch(`${this.api.get('manageCategory')}/UpdateCategory`, body);
  }
  /**
   * funcion para verificar el status de la categoria creada de forma unitaria
   *
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  verifyStatusOfCreateCategory(): Observable<any> {
    return this.http.get(this.api.get('statusCreateCategory'), { observe: 'response' });
  }
  /**
   * funcion para validar el status de la carga masiva de categorias
   *
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  validateStatusCreateUpdateMassive(): Observable<any> {
    return this.http.get(this.api.get('ValidateStatusCreateUpdateMassive'), { observe: 'response' });
  }
  /**
   * funcuon para descargar desde el s3 el archivo plantilla para la carga masiva de categorias
   *
   * @returns {Observable<any>}
   * @memberof CategoryTreeService
   */
  downloadTemplateCategoryMasive(): Observable<any> {
    return this.http.get(this.api.get('downloadTemplateCategoryMasive'), { observe: 'response' });
  }
  /**
   * funcion para eliminar categoria
   *
   * @param {*} id
   * @returns {Observable<{}>}
   * @memberof CategoryTreeService
   */
  public deleteCategory(id: any): Observable<{}> {
    return this.http.delete(this.api.get('deleteCategory', [id]));
  }

}
