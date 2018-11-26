
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RoutesConst } from '@app/shared';

@Injectable()
export class TermsService implements CanActivate {

    json = {
            status: 200,
            data: true
        };

    constructor(private router: Router) {

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
                // this.router.navigate([`/${RoutesConst.error}`]);
            }
        }, error => {
            this.router.navigate([`/${RoutesConst.error}`]);
        });
    }

}
