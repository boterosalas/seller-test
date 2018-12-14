
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TermsComponent } from './terms.component';

@Injectable()
export class TermsService implements CanActivate {

    json = {
            status: 200,
            data: true,
            src: 'https://s3.amazonaws.com/sellercenter.nuget/Logger/Acuerdo+Comercial+Marketplace+-+Actualizado+16-11-2018.pdf'
        };

    constructor(private router: Router, public dialog: MatDialog) {

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
        of(this.json).subscribe( (data: any) => {
            if (data.data) {
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
        const dialogRef = this.dialog.open(TermsComponent, {
          width: '80%',
          height: '90%',
          data: data,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }

}
