import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DynamoDBService, LoggedInCallback, UserLoginService } from '@app/core';
import { RoutesConst } from '@app/shared';


export class Stuff {
    public type: string;
    public date: string;
}

@Component({
    selector: 'app-awscognito',
    templateUrl: './useractivity.html'
})
export class UseractivityComponent implements LoggedInCallback {

    public logdata: Array<Stuff> = [];

    constructor(public router: Router, public ddb: DynamoDBService, public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
        // 'in UseractivityComponent';
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        } else {
            // scanning DDB
            this.ddb.getLogEntries(this.logdata);
        }
    }

}
