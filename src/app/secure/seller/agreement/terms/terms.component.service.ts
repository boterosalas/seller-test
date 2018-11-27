
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
            data: true
        };

    constructor(private router: Router, public dialog: MatDialog) {

    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.log('aqui');
        this.getSellerAgreement();
        return true;
    }


    getSellerAgreement(): any {
        of(this.json).subscribe( (data: any) => {
            console.log(data);
            if (data.data) {
                console.log(data.data);
                this.openDialog();
                // this.router.navigate([`/${RoutesConst.error}`]);
            }
        }, error => {
            this.router.navigate([`/${RoutesConst.error}`]);
        });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(TermsComponent, {
          width: '70%',
          height: '80%',
          data: null,
          disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }

}
