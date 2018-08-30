import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UserLoginService } from '@app/shared/services/aws-cognito/user-login.service';
import { CognitoCallback, CognitoUtil } from '@app/shared/services/aws-cognito/cognito.service';

@Component({
    selector: 'app-get-token',
    templateUrl: './token.component.html'
})
export class GetTokenComponent implements OnInit, CognitoCallback {

    public email: any;
    public password: any;
    public idToken: any;
    public message: any;

    constructor(
        private _route: ActivatedRoute,
        public userService: UserLoginService,
        public cognitoUtil: CognitoUtil
    ) { }

    ngOnInit(): void {
        this._route.params.forEach((params: Params) => {
            this.email = params.email;
            this.password = params.password;
            this.userService.authenticate(this.email, this.password, this);
        });
    }

    cognitoCallback(message: string, result: any) {
        this.message = message;
        if (this.message != null) { // error
        } else { // success
            this.idToken = this.cognitoUtil.getTokenLocalStorage();
            this.userService.logout();
            localStorage.clear();
        }
    }
}
