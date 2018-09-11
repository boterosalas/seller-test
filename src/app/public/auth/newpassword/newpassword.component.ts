import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoCallback, UserLoginService, UserRegistrationService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { Logger } from '@core/util/logger.service';

const log = new Logger('NewPasswordComponent');

export class NewPasswordUser {
    username: string;
    existingPassword: string;
    password: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'app-awscognito',
    templateUrl: './newpassword.html'
})
export class NewPasswordComponent implements CognitoCallback, OnInit {
    registrationUser: NewPasswordUser;
    router: Router;
    errorMessage: string;

    constructor(public userRegistration: UserRegistrationService, public userService: UserLoginService, router: Router) {
        this.router = router;
        this.onInit();
    }

    onInit() {
        this.registrationUser = new NewPasswordUser();
        this.errorMessage = null;
    }

    ngOnInit() {
        this.errorMessage = null;
        this.userService.isAuthenticated(this);
    }

    onRegister() {
        log.debug(this.registrationUser);
        this.errorMessage = null;
        this.userRegistration.newPassword(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            log.error('result: ' + this.errorMessage);
        } else { // success
            // move to the next step
            log.debug('redirecting');
            log.debug(result);
            // this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }
}
