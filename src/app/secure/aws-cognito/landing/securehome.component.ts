import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoggedInCallback, UserLoginService } from '@app/core';
import { RoutesConst } from '@app/shared';


@Component({
  selector: 'app-awscognito',
  templateUrl: './secureHome.html'
})
export class SecureHomeComponent implements LoggedInCallback {
  constructor(
    public router: Router,
    public userService: UserLoginService
  ) {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate([`/${RoutesConst.homeLogin}`]);
    }
  }
} // End class
