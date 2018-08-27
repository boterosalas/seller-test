import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Logger } from '@app/core/util/logger.service';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { Callback, CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';


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
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;

  constructor(
    private cognitoUtil: CognitoUtil,
    private userService: UserLoginService,
    private userParams: UserParametersService,
    private router: Router,
  ) {
    this.user = {};
  }

  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  callback() {
  }

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
