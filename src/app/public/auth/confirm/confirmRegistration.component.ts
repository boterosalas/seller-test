import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    UserRegistrationService,
    UserLoginService,
    LoggedInCallback,
    RoutesConst
} from '@app/shared';
import { ShellComponent } from '@app/core/shell/shell.component';

@Component({
    selector: 'app-awscognito',
    template: ''
})
export class LogoutComponent implements LoggedInCallback {

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public shell: ShellComponent) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        this.shell.showHeader = false;
        this.userService.logout();
        localStorage.clear();
        this.router.navigate([`/${RoutesConst.homeLogin}`]);
    }
}

@Component({
    selector: 'app-awscognito',
    templateUrl: './confirmRegistration.html'
})
export class RegistrationConfirmationComponent implements OnInit, OnDestroy {
    confirmationCode: string;
    email: string;
    errorMessage: string;
    private sub: any;

    constructor(public regService: UserRegistrationService, public router: Router, public route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];

        });

        this.errorMessage = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onConfirmRegistration() {
        this.errorMessage = null;
        this.regService.confirmRegistration(this.email, this.confirmationCode, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) {
            this.errorMessage = message;
            console.log('message: ' + this.errorMessage);
        } else {
            // this.configs.curUser = result.user;
            this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }
}
