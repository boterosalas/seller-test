import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserLoginService} from '../../service/user-login.service';
import {LoggedInCallback} from '../../service/cognito.service';

@Component({
    selector: 'app-awscognito',
    templateUrl: './secureHome.html'
})
export class SecureHomeComponent implements OnInit, LoggedInCallback {

    constructor(public router: Router, public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
    }

    ngOnInit() {

    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate(['/home/login']);
        }
    }
}
