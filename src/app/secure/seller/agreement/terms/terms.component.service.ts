
import { Observable, Subject } from 'rxjs';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst, Const } from '@app/shared';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TermsComponent } from './terms.component';
import { HttpClient } from '@angular/common/http';
import { EndpointService, UserParametersService } from '@app/core';
import { UnreadCaseResponse } from '@app/secure/seller-support-center/models/unread-case-response.model';

@Injectable()
export class TermsService implements CanActivate {

    localStorage_ModalContract = 'true';
    state: RouterStateSnapshot;
    constantes = new Const();
    private dialogRef: MatDialogRef<TermsComponent>;

    constructor(private router: Router,
        public dialog: MatDialog,
        private http: HttpClient,
        private api: EndpointService,
        private userParams: UserParametersService,
        public termsComponent: TermsComponent) {
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
        this.state = state;
        if (state.url !== '/' + RoutesConst.sellerCenterLogout) {
            this.getSellerAgreement(state, true);
        }
        return true;
    }


    /**
     * Obtiene la informacion relacionada del vendedor para obtener si este, ya acepto los terminos.
     *
     * @returns {*}
     * @memberof TermsService
     */
    getSellerAgreement(state: RouterStateSnapshot, showModal: boolean): any {
        this.getUserInfo().then(resultPromise => {
            if (resultPromise) {
                this.http.get(this.api.get('getValidationTerms'), { headers: { valid: '' } }).subscribe((result: any) => {
                    if (result && result.body) {
                        try {
                            const data = JSON.parse(result.body);
                            if (data.Data && data.Data.StatusContract === true) {
                                if (state.url !== '/' + RoutesConst.securehome) {
                                    this.router.navigate(['/' + RoutesConst.securehome]);
                                }
                            } else {
                                    if (showModal) {
                                        this.openDialog(data.Data);
                                    } else {
                                        if (this.dialogRef && this.dialogRef.componentInstance) {
                                            this.dialogRef.componentInstance.data = data.Data;
                                          }
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
    openDialog(data: any): void {
        const dialogRef = this.dialog.open(TermsComponent, {
            width: '80%',
            height: '90%',
            data: data,
            disableClose: true
        });
        this.dialogRef = dialogRef;
        const dialogIntance = dialogRef.componentInstance;
        dialogIntance.processFinish$.subscribe((val) => {
            // if (val) {
            //     this.getSellerAgreement(this.state, false);
            // } else {
            //     location.reload();
            // }
          });
    }

    public getPendingDevolutions(): Observable<UnreadCaseResponse> {
        const URL = this.api.get('getPendinOrders');
        return this.http.get<UnreadCaseResponse>(URL);
      }

}
