import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesConst } from '@shared/util';
import { CategoryList, UserInformation } from '@shared/models';
import { environment } from '@env/environment';

import { LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { Logger } from '@core/util/logger.service';
import { ShellComponent } from '@core/shell/shell.component';
import { Modules, MenuModel, ProfileTypes } from '@app/secure/auth/auth.consts';

// log component
const log = new Logger('SideBarComponent');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, LoggedInCallback {
  // Sidenav principal
  @Input() sidenav;
  // Información del usuario
  @Input() user: UserInformation;
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;
  // Lista de categorías de las órdenes
  categoryList: any;
  public routes = RoutesConst;
  public modules = Modules;
  prueba = 'solicitudes-pendientes';

  constructor(
    private route: Router,
    public shellComponent: ShellComponent,
    public userService: UserLoginService,
    public userParams: UserParametersService
  ) { }

  /**
   * @memberof SidebarComponent
   */
  ngOnInit() {
    this.categoryList = this.routes.CATEGORYLIST;
    this.userService.isAuthenticated(this);
    console.log(this.modules, Modules);
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
    }
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
   * Funcion que se encarga de verificar que menus se debe de mostrar y cuales no, aqui debe ir la enumeracion que envia back con los menus pertenecientes al usuario.
   *
   * @param {MenuModel} menu
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  showMenu(menu: MenuModel): boolean {
    // if(this.user?.sellerProfile === 'administrator')
    // console.log(menu);
    // console.log(menu.NameMenu, menu.ShowMenu && ( this.isProductionEnv && menu.ShowMenuProduction || !this.isProductionEnv) && this.validateUserType(menu.ProfileType));
    return menu.ShowMenu && ( this.isProductionEnv && menu.ShowMenuProduction || !this.isProductionEnv) && this.validateUserType(menu.ProfileType);
  }

  validateUserType(profileType: number): boolean {
    return this.user.sellerProfile === 'administrator' ? profileType === ProfileTypes.Administrador : profileType === ProfileTypes.Vendedor;
  }
}
