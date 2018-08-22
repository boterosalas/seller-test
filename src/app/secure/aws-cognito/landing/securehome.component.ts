import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { ShellComponent } from '@core/shell/shell.component';

@Component({
    selector: 'app-awscognito',
    templateUrl: './secureHome.html'
})

export class SecureHomeComponent implements LoggedInCallback {


    constructor(
        public shell: ShellComponent,
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        }
    }
}
