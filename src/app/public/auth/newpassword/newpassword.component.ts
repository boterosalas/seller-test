import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoCallback, UserLoginService, UserRegistrationService } from '@app/core';
import { RoutesConst } from '@app/shared';

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
        console.log(this.registrationUser);
        this.errorMessage = null;
        this.userRegistration.newPassword(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { // error
            this.errorMessage = message;
            console.log('result: ' + this.errorMessage);
        } else { // success
            // move to the next step
            console.log('redirecting');
            console.log(result);
            // this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (isLoggedIn) {
            this.router.navigate([`/${RoutesConst.securehome}`]);
        }
    }
}
