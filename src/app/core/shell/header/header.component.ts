import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  Callback,
  CognitoUtil,
  LoggedInCallback,
  Logger,
  RoutesConst,
  UserLoginService,
  UserParametersService,
} from '@app/shared';
import { environment } from '@env/environment';

import { ShellComponent } from '../shell.component';

// log component
const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, LoggedInCallback, Callback {

  // booleano para visualizar la barra de toolbar
  @Input() viewToolbarPrincipal: boolean;
  // Información del usuario
  @Input() user: any;
  // Sidenav principal
  @Input() sidenav;
  // Url que se emplea para acceder a el atributo del usuario que se arma con un nombre de url
  public webUrl = environment.webUrl;
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;
  /**
   * Creates an instance of HeaderComponent.
   * @param {ShellComponent} shellComponent
   * @memberof HeaderComponent
   */
  constructor(
    public shellComponent: ShellComponent,
    public cognitoUtil: CognitoUtil,
    public userService: UserLoginService,
    public userParams: UserParametersService,
    public router: Router,
  ) {
    this.user = {};
  }

  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
      this.routes = RoutesConst;
    }
  }

  goToHome() {
    if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    } else if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
    }
  }
  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof HeaderComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

}
