import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoCallback, UserRegistrationService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { Logger } from '@core/util/logger.service';

const log = new Logger('RegisterComponentAWS');

export class RegistrationUser {
    name: string;
    email: string;
    phone_number: string;
    password: string;
}
/**
 * This component is responsible for displaying and controlling
 * the registration of the user.
 */
@Component({
    selector: 'app-awscognito',
    templateUrl: './registration.html'
})
export class RegisterComponent implements CognitoCallback {
    registrationUser: RegistrationUser;
    router: Router;
    errorMessage: string;

    constructor(public userRegistration: UserRegistrationService, router: Router) {
        this.router = router;
        this.onInit();
    }

    onInit() {
        this.registrationUser = new RegistrationUser();
        this.errorMessage = null;
    }

    onRegister() {
        this.errorMessage = null;
        this.userRegistration.register(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            log.error('result: ' + this.errorMessage);
        } else { // success
            // move to the next step
            log.debug('redirecting');
            this.router.navigate([`/${RoutesConst.homeConfirmRegistration}`, result.user.username]);
        }
    }
}
