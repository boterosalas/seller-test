import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndpointService } from '@app/core';
import { Observable } from 'rxjs/Observable';
import { String } from 'aws-sdk/clients/rdsdataservice';

export interface BrandModel {
  IdBrand: number;
  NameBrand: string;
}

export interface Brands {
  id: number;
  name: string;
  status: boolean;
  paginationToken: string;
}


@Injectable()
export class BrandService {

  constructor(
    private http: HttpClient,
    private api: EndpointService
  ) { }

  getAllBrands(params?: any): Observable<any> {
    const loadMore = params.split('/', 4);
    let brands: Brands[];
    if (loadMore[2] === '0') {
      brands = [
        { id: 1, name: 'carulla', status: true, paginationToken: '1|65' },
        { id: 2, name: 'Troopx', status: true, paginationToken: '2|65' },
        { id: 3, name: 'Textil', status: false, paginationToken: '3|65' },
        { id: 4, name: 'Taeq', status: false, paginationToken: '4|65' },
        { id: 5, name: 'Surtimax', status: true, paginationToken: '5|65' },
        { id: 6, name: 'Super Inter', status: true, paginationToken: '6|65' },
        { id: 7, name: 'Porchi', status: false, paginationToken: '7|65' },
        { id: 8, name: 'Pomona', status: false, paginationToken: '8|65' },
        { id: 9, name: 'Exito', status: true, paginationToken: '9|65' },
        { id: 10, name: 'Ekono', status: false, paginationToken: '10|65' },
        { id: 11, name: 'Cautivia', status: true, paginationToken: '11|65' },
        { id: 12, name: 'Arkitect', status: true, paginationToken: '12|65' },
        { id: 13, name: 'People', status: true, paginationToken: '13|65' },
        { id: 14, name: 'Bronzini', status: true, paginationToken: '14|65' },
        { id: 15, name: 'WKD', status: true, paginationToken: '15|65' },
        { id: 16, name: 'Coquí', status: true, paginationToken: '16|65' },
        { id: 17, name: 'Custer', status: true, paginationToken: '17|65' },
        { id: 18, name: 'Carrel', status: true, paginationToken: '18|65' },
        { id: 19, name: 'Bluss', status: true, paginationToken: '19|65' },
        { id: 20, name: 'Eventi', status: true, paginationToken: '20|65' },
        { id: 21, name: 'Carulla1', status: false, paginationToken: '21|65' },
        { id: 22, name: 'Troopx1', status: true, paginationToken: '22|65' },
        { id: 23, name: 'Textil1', status: true, paginationToken: '23|65' },
        { id: 24, name: 'Taeq1', status: true, paginationToken: '24|65' },
        { id: 25, name: 'Surtimax1', status: false, paginationToken: '25|65' },
        { id: 26, name: 'Super Inter1', status: true, paginationToken: '26|65' },
        { id: 27, name: 'Porchi1', status: true, paginationToken: '27|65' },
        { id: 28, name: 'Pomona1', status: false, paginationToken: '28|65' },
        { id: 29, name: 'Exito1', status: false, paginationToken: '29|65' },
        { id: 30, name: 'Ekono1', status: true, paginationToken: '30|65' },
        { id: 31, name: 'Cautivia1', status: true, paginationToken: '31|65' },
        { id: 32, name: 'Arkitect1', status: true, paginationToken: '32|65' },
        { id: 33, name: 'People1', status: false, paginationToken: '33|65' },
        { id: 34, name: 'Bronzini1', status: true, paginationToken: '34|65' },
        { id: 35, name: 'WKD1', status: true, paginationToken: '35|65' },
        { id: 36, name: 'Coquí1', status: false, paginationToken: '36|65' },
        { id: 37, name: 'Custer1', status: true, paginationToken: '37|65' },
        { id: 38, name: 'Carrel1', status: true, paginationToken: '38|65' },
        { id: 39, name: 'Bluss1', status: true, paginationToken: '39|65' },
        { id: 40, name: 'Eventi1', status: true, paginationToken: '40| 65' },
        { id: 41, name: 'Eventi1', status: true, paginationToken: '41| 65' },
        { id: 42, name: 'Eventi1', status: true, paginationToken: '42| 65' },
        { id: 43, name: 'Eventi1', status: true, paginationToken: '43| 65' },
        { id: 44, name: 'Eventi1', status: true, paginationToken: '44| 65' },
        { id: 45, name: 'Eventi1', status: true, paginationToken: '45| 65' },
        { id: 46, name: 'Eventi1', status: true, paginationToken: '46| 65' },
        { id: 47, name: 'Eventi1', status: true, paginationToken: '47| 65' },
        { id: 48, name: 'Eventi1', status: true, paginationToken: '48| 65' },
        { id: 49, name: 'Eventi1', status: true, paginationToken: '49| 65' },
        { id: 50, name: 'Eventi1', status: true, paginationToken: '50| 65' },
      ];
    } else {
      brands = [
        { id: 51, name: 'Eventi1', status: true, paginationToken: '51|65' },
        { id: 52, name: 'Eventi1', status: true, paginationToken: '52|65' },
        { id: 53, name: 'Eventi1', status: true, paginationToken: '53|65' },
        { id: 54, name: 'Eventi1', status: true, paginationToken: '54|65' },
        { id: 55, name: 'Eventi1', status: true, paginationToken: '55|65' },
        { id: 56, name: 'Eventi1', status: true, paginationToken: '56|65' },
        { id: 57, name: 'Eventi1', status: true, paginationToken: '57|65' },
        { id: 58, name: 'Eventi1', status: true, paginationToken: '58|65' },
        { id: 59, name: 'Eventi1', status: true, paginationToken: '59|65' },
        { id: 60, name: 'Eventi1', status: true, paginationToken: '60|65' },
        { id: 61, name: 'Eventi1', status: true, paginationToken: '61|65' },
        { id: 62, name: 'Eventi1', status: true, paginationToken: '62|65' },
        { id: 63, name: 'Eventi1', status: true, paginationToken: '63|65' },
        { id: 64, name: 'Eventi1', status: true, paginationToken: '64|65' },
        { id: 65, name: 'Eventi1', status: true, paginationToken: '65|65' },
      ];
    }
    return new Observable((observer) => {
      return observer.next({ brands, totalLength: 65 });
    });
  }

  changeStatusBrands(body: any): Observable<any> {
    // return this.http.patch(this.api.get('cancelVacationSeller'), body, {observe: 'response'});
    return new Observable((observer) => {
      return observer.next(body.status);
    });
  }


  /**
   * @method fetchData
   * @param paramValue
   * @param param
   * @description Método para validar los datos de: NIT, E-mail, Nombre de la tienda
   * @memberof RegisterService
   */
  validateExistBrands(nameBrands: String): Observable<{}> {
    //cambiar cuando el back este listo
      // return this.http.get(this.api.get('getValidateBrands') + nameBrands);
      return new Observable((observer) => {
        return observer.next(true);
      });
  }

}
