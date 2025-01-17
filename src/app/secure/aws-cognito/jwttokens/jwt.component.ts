import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Callback, CognitoUtil, LoggedInCallback, UserLoginService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { Logger } from '@core/util/logger.service';

const log = new Logger('JwtComponent');

export class Stuff {
    public accessToken: string;
    public idToken: string;
}

@Component({
    selector: 'app-awscognito',
    templateUrl: './jwt.html'
})
export class JwtComponent implements LoggedInCallback {

    public stuff: Stuff = new Stuff();

    constructor(public router: Router, public userService: UserLoginService, public cognitoUtil: CognitoUtil) {
        this.userService.isAuthenticated(this);
        log.debug('in JwtComponent');
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        } else {
            this.cognitoUtil.getAccessToken(new AccessTokenCallback(this));
            this.cognitoUtil.getIdToken(new IdTokenCallback(this));
        }
    }
}

export class AccessTokenCallback implements Callback {
    constructor(public jwt: JwtComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.jwt.stuff.accessToken = result;
    }
}

export class IdTokenCallback implements Callback {
    constructor(public jwt: JwtComponent) {

    }

    callback() {

    }

    callbackWithParam(result) {
        this.jwt.stuff.idToken = result;
    }
}
