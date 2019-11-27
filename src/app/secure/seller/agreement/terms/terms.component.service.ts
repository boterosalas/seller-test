
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst, Const } from '@app/shared';
import { MatDialog } from '@angular/material';
import { TermsComponent } from './terms.component';
import { HttpClient } from '@angular/common/http';
import { EndpointService, UserParametersService } from '@app/core';

@Injectable()
export class TermsService implements CanActivate {

    // Contrato actual
    // srcPdf = 'https://s3.amazonaws.com/seller.center.exito.seller/Template/Acuerdo_Comercial_Marketplace_-_Actualizado_26-12-2018_Versi%C3%B3n_Mostrar.pdf';
    // srcPdf = 'https://s3.amazonaws.com/seller.center.exito.seller/Template/Acuerdo_Comercial_Marketplace_-_Actualizado_10-09-2019_Versi%C3%B3n_Mostrar.pdf';
    // Contrato nuevo NOVIEMBRE
    srcPdf = 'https://s3.amazonaws.com/seller.center.exito.seller/Template/Acuerdo_Comercial_Marketplace_-_Actualizado_26-11-2019_Versi%C3%B3n_Mostrar.pdf';


    constantes = new Const();

    constructor(private router: Router,
        public dialog: MatDialog,
        private http: HttpClient,
        private api: EndpointService,
        private userParams: UserParametersService) {

    }

    /**
     * Funcion la cual se conecta con los enrutadores de angular para poder ejecutar validaciones previas al direccionamiento,
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
        if (state.url !== '/' + RoutesConst.sellerCenterLogout) {
            this.getSellerAgreement(state);
        }
        return true;
    }


    /**
     * Obtiene la informacion relacionada del vendedor para obtener si este, ya acepto los terminos.
     *
     * @returns {*}
     * @memberof TermsService
     */
    getSellerAgreement(state: RouterStateSnapshot): any {
        this.getUserInfo().then(resultPromise => {
            if (resultPromise) {
                this.http.get(this.api.get('getValidationTerms'), { headers: { valid: 'hola' } }).subscribe((result: any) => {
                    if (result && result.body) {
                        try {
                            const data = JSON.parse(result.body);
                            if (!data.Data) {
                                if (state.url !== '/' + RoutesConst.securehome) {
                                    this.router.navigate(['/' + RoutesConst.securehome]);
                                } else {
                                    this.openDialog(data.src);
                                }
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }, error => {
                    this.router.navigate([`/${RoutesConst.error}`]);
                });
            }
        });
    }

    /**
     * Funcion que verifica si el usuario que esta logeado puede ingresar a la pagina
     * 1.   Verifica la URL a la que esta intentando ingresar para validar que tipo de usuario es,
     *      si no es valido lo redirecciona a home
     * @param {RouterStateSnapshot} state
     * @returns {Promise<any>}
     * @memberof SellerService
     */
    public getUserInfo(): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                this.userParams.getUserData().then(data => {
                    /**  Vista de lista de vendedores */
                    if (data.sellerProfile === this.constantes.seller) {
                        resolve(true);
                    }
                }, error => {
                    reject(error);
                });
            });
        } catch (e) {
        }
    }

    /**
     * Abre el dialogo con la direccion del pdf a mostrar.
     *
     * @param {string} data
     * @memberof TermsService
     */
    openDialog(data: string): void {
        const dialogRef = this.dialog.open(TermsComponent, {
            width: '80%',
            height: '90%',
            data: this.srcPdf,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}
