/* 3rd party components */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

/* our own custom components */
import {User} from '../../shared/models/login.model';
import {BaseSellerService} from '../../shared/services/base-seller.service';

@Injectable()

/**
 * Clase LoadGuideService
 */
export class LoadGuideService extends BaseSellerService {

  /**
   * Método para realiar la consulta de las transportadoras
   * @param user
   * @param {any} guide
   * @returns {Observable<[{}]>}
   * @memberof LoadGuideService
   */
  sendAllGuides(user, guide): Observable<[{}]> {

    this.changeEndPoint();
    return new Observable(observer => {
      this.http.patch(this.api.get('sendAllGuides'), guide, this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, err => {
        this.hehs.error(err, () => {
          observer.error(err);
        });
      });
    });
  }

  /**
   * Método para decargar la información para el formato de guía
   * @param {User} user
   * @param {any} stringUrl
   * @returns {Observable<[{}]>}
   * @memberof LoadGuideService
   */
  downloadInformationForGuide(user: User, stringUrl): Observable<[{}]> {

    this.changeEndPoint();

    return new Observable(observer => {

      this.http.get(this.api.get('getallordersbysellerwithouttracking', [stringUrl]),
        this.getHeaders(user)).subscribe((data: any) => {
        observer.next(data);
      }, error => {
        this.hehs.error(error, () => {
          observer.error(error);
        });
      });
    });
  }
}
