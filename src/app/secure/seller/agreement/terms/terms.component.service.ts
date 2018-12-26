
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TermsComponent } from './terms.component';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable()
export class TermsService implements CanActivate {

    srcPdf = 'https://s3.amazonaws.com/seller.center.exito.seller/ContractDev/acuerdo_comercial_marketplace_-_actualizado_26-12-2018_versi__n_mostrar.pdf';

    constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private api: EndpointService) {

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
        this.getSellerAgreement();
        return true;
    }


    /**
     * Obtiene la informacion relacionada del vendedor para obtener si este, ya acepto los terminos.
     *
     * @returns {*}
     * @memberof TermsService
     */
    getSellerAgreement(): any {
        this.http.get(this.api.get('getValidationTerms')).subscribe( (result: any) => {
            if (result && result.body) {
                try {
                    const data  = JSON.parse(result.body);
                    if (!data.Data) {
                        this.openDialog(data.src);
                    }
                } catch (e) {
                    console.error(e);
                }
                // TODO: this.openDialog(data.src);
                // this.router.navigate([`/${RoutesConst.error}`]);
            }
        }, error => {
            this.router.navigate([`/${RoutesConst.error}`]);
        });
    }

    /**
     * Abre el dialogo con la direccion del pdf a mostrar.
     *
     * @param {string} data
     * @memberof TermsService
     */
    openDialog(data: string): void {
        console.log(this.srcPdf);
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
