
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst, Const } from '@app/shared';
import { UserParametersService, EndpointService } from '@app/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class SellerService implements CanActivate {

    user = null;
    constantes: Const = new Const();
    constructor(
        private router: Router,
        public userParams: UserParametersService,
        private http: HttpClient,
        private api: EndpointService
        ) {
    }

    /**
     * Funcion con la cual se conecta con los enrutadores de angular para poder ejecutar validaciones previas al direccionamiento,
     * en este caso lo que hace es validar si el usuario ya acepto los terminos de uso de la aplicacion.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
     * @memberof TermsService
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.getUserInfo(state);
    }

    /**
     * Funcion que verifica si el usuario que esta logeado puede ingresar a la pagina
     * 1.   Verifica la URL a la que esta intentando ingresar para validar que tipo de usuario es,
     *      si no es valido lo redirecciona a home
     * @param {RouterStateSnapshot} state
     * @returns {Promise<any>}
     * @memberof SellerService
     */
    public getUserInfo(
        state: RouterStateSnapshot
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.userParams.getUserData().then(data => {
                /**  Vista de lista de vendedores */
                if (state.url.search(RoutesConst.sellerCenterIntSellerList)) {
                    if (data.sellerProfile === this.constantes.administrator) {
                        resolve(true);
                    } else {
                        this.redirectToHome();
                        resolve(false);
                    }
                }
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * Redirecciona al home de vendedores
     *
     * @memberof SellerService
     */
    public redirectToHome(): void {
        this.router.navigate([`/${RoutesConst.securehome}`]);
    }


    getOrderList(params: any): Observable<[{}]> {
        const varUnde = undefined;
        return new Observable(observer => {
          this.http.get<any[]>(this.api.get('searchOrders', [params.idSeller, params.limit + `&idStatusOrder=${varUnde}`  ])).subscribe((data: any) => {
            observer.next(data);
          }, err => {
            observer.error(err);
          });
        });
      }


      public appplyAgreement(data: any): Observable<any> {
          console.log(data);
        return new Observable(observer => {
            observer.next(true);
          });
    }


}
