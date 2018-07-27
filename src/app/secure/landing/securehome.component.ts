import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLoginService } from '../../service/user-login.service';
import { LoggedInCallback, CognitoUtil } from '../../service/cognito.service';
import { ShellComponent } from '../seller-center/shell/shell.component';
import { UserParametersService } from '../../service/user-parameters.service';
import { UserService } from '../seller-center/utils/services/common/user/user.service';

@Component({
    selector: 'app-awscognito',
    templateUrl: './secureHome.html'
})

export class SecureHomeComponent implements LoggedInCallback {


    constructor(
        public shell: ShellComponent,
        public userServiceProvider: UserService,
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn ) {
            this.router.navigate(['/home/login']);
        }
    }
}
