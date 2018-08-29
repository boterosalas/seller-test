import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService, LoggedInCallback, RoutesConst } from '@app/shared';

declare let AWS: any;
declare let AWSCognito: any;

@Component({
    selector: 'app-awscognito',
    template: '<p>Bienvenido</p>'
})
export class AboutComponent {

}

@Component({
    selector: 'app-awscognito',
    templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
    constructor() {
    }
}

@Component({
    selector: 'app-awscognito',
    templateUrl: './home.html'
})
export class HomeComponent implements OnInit, LoggedInCallback {

    constructor(
        public router: Router,
        public userService: UserLoginService) {
    }

    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }
}


