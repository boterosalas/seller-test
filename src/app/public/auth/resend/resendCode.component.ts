import {Component} from '@angular/core';
import {UserRegistrationService, CognitoCallback, RoutesConst} from '@app/shared';
import {Router} from '@angular/router';

@Component({
    selector: 'app-awscognito',
    templateUrl: './resendCode.html'
})
export class ResendCodeComponent implements CognitoCallback {

    email: string;
    errorMessage: string;

    constructor(public registrationService: UserRegistrationService, public router: Router) {

    }

    resendCode() {
        this.registrationService.resendCode(this.email, this);
    }

    cognitoCallback(error: any, result: any) {
        if (error != null) {
            this.errorMessage = 'Something went wrong...please try again';
        } else {
            this.router.navigate([`/${RoutesConst.homeConfirmRegistration}`, this.email]);
        }
    }
}
