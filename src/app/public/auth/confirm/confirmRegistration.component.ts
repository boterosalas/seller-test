import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRegistrationService } from '../../../service/user-registration.service';
import { UserLoginService } from '../../../service/user-login.service';
import { LoggedInCallback } from '../../../service/cognito.service';

@Component({
    selector: 'app-awscognito',
    template: ''
})
export class LogoutComponent implements LoggedInCallback {

    constructor(public router: Router,
        public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.userService.logout();
            localStorage.clear();
            this.router.navigate(['/home']);
        }
        localStorage.clear();
        this.router.navigate(['/home']);
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
            console.log('Moving to securehome');
            // this.configs.curUser = result.user;
            this.router.navigate(['/securehome']);
        }
    }
}