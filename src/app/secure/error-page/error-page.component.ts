/* 3rd party components */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShellComponent } from '@core/shell/shell.component';
import {
  RoutesConst,
  UserLoginService,
  UserParametersService,
  LoggedInCallback,
  Callback
} from '@app/shared';


/* our own custom components */


/**
 * Component
 */
@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
})

/**
 * Componente para visualizar la pestaña de error, esta pagina se visualiza cuando el usuario ingresa una url erronea.
 */
export class ErrorPageComponent implements OnInit, LoggedInCallback, Callback {
  public routes: any;
  public user: any;
  public isLoged = false;
  /**
   * Creates an instance of ErrorPageComponent.
   * @param {ShellComponent} shellComponent
   * @memberof ErrorPageComponent
   */
  constructor(
    private shell: ShellComponent,
    public userService: UserLoginService,
    private router: Router,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  /**
   * @memberof ErrorPageComponent
   */
  ngOnInit() {
    this.routes = RoutesConst;
    this.shell.viewToolbarPrincipal = false;
    this.shell.showHeader = false;
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    }
  }

  callback() { }

  getDataUser() {
    this.isLoged = true;
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  goToHome() {
    if (this.isLoged && this.isLoged === true) {
      this.shell.viewToolbarPrincipal = true;
      this.shell.showHeader = true;
      if (this.user.sellerProfile === 'administrator') {
        this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
      } else if (this.user.sellerProfile === 'seller') {
        this.router.navigate([`/${RoutesConst.sellerCenterOrders}`]);
      }
    } else if (!this.isLoged && this.isLoged === false) {
      this.router.navigate([`/${RoutesConst.homeLogin}`]);
    }
  }
}