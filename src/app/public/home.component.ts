import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoggedInCallback, UserLoginService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { ViewChild } from '@root/node_modules/@angular/core';
import { LoadingComponent } from '@shared/components/loading/loading.component';


declare let AWS: any;
declare let AWSCognito: any;

@Component({
  selector: 'app-awscognito',
  template: '<p>Bienvenido</p>'
})
export class AboutComponent {

}

@Component({
  selector: 'app-awscognito',
  templateUrl: './landinghome.html'
})
export class HomeLandingComponent {
  constructor() {
  }
}

@Component({
  selector: 'app-awscognito',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, LoggedInCallback {
  // Loading de la pagina
  @ViewChild(LoadingComponent) loadingComponent: LoadingComponent;

  constructor(
    public router: Router,
    public userService: UserLoginService) {
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate([`/${RoutesConst.securehome}`]);
    }
  }
}


