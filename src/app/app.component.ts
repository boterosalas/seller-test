import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AwsUtil } from './service/aws.service';
import { UserLoginService } from './service/user-login.service';
import { CognitoUtil, LoggedInCallback } from './service/cognito.service';

@Component({
    selector: 'app-root',
    templateUrl: 'template/app.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false
})
export class AppComponent implements OnInit, LoggedInCallback {

    constructor(
        public awsUtil: AwsUtil,
        public userService: UserLoginService,
        public cognito: CognitoUtil) {
    }

    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        const mythis = this;
        this.cognito.getIdToken({
            callback() {
            },
            callbackWithParam(token: any) {
                // Include the passed-in callback here as well so that it's executed downstream
                mythis.awsUtil.initAwsService(null, isLoggedIn, token);
            }
        });
    }
}

