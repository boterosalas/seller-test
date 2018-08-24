import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesConst } from '@shared/util';
import { CategoryList } from '@shared/models';
import { environment } from '@env/environment';

import { Callback, LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { Logger } from '@core/util/logger.service';
import { ShellComponent } from '@core/shell/shell.component';

// log component
const log = new Logger('SideBarComponent');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, LoggedInCallback, Callback {

  // Sidenav principal
  @Input() sidenav;
  // Información del usuario
  @Input() user: any;
  // web url. empleada para saber cual es la url del servidor
  webUrl = environment.webUrl;
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;
  // Lista de categorías de las órdenes
  categoryList: any;
  public routes: any;

  /**
   * Creates an instance of SidebarComponent.
   * @param {Router} route
   * @param {ShellComponent} shellComponent
   * @param {LogoutComponent} logoutComponent
   * @memberof SidebarComponent
   */
  constructor(
    private route: Router,
    public shellComponent: ShellComponent,
    public userService: UserLoginService,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  /**
   * @memberof SidebarComponent
   */
  ngOnInit() {
    this.routes = RoutesConst;
    this.categoryList = this.routes.CATEGORYLIST;
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
    }
  }

  callback() { }

  getDataUser() {
    this.userParams.getUserData(this);
  }

  callbackWithParam(userData: any) {
    this.user = userData;
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

  /**
   * Método para dirigir al usuario a una vista en especifica
   * @param {CategoryList} category
   * @memberof SidebarComponent
   */
  goToRoot(category: CategoryList) {
    if (category.id !== '') {
      this.route.navigate([category.root, category.id]);
    } else {
      this.route.navigate([category.root]);
    }
  }

  /**
   * Método para cerrar sesión
   * @memberof SidebarComponent
   */
  logout() {
    /* this.logoutComponent.logout(); */
  }
}
