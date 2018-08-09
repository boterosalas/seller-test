/* 3rd party components */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/* our own custom components */
import { CategoryList } from '../models';
import { RoutesConst } from '../util';
import { LoggedInCallback, Callback, UserLoginService, UserParametersService } from '../services';
import { environment } from '@env/environment';
/**
 * Component
 */
@Component({
  selector: 'app-toolbar-link',
  templateUrl: './toolbar-link.component.html',
  styleUrls: ['./toolbar-link.component.scss'],
})

/**
 * Componente Toolbar para los links de la orden
 */
export class ToolbarLinkComponent implements OnInit, LoggedInCallback, Callback {

  public routes: any;
  public user: any;
  // Estructura para la categoría
  categoryEstructure = {
    root: 'home'
  };

  // Lista de categorías
  public categoryList: any;
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;

  /**
   * Creates an instance of ToolbarLinkComponent.
   * @param {Router} route
   * @memberof ToolbarLinkComponent
   */
  constructor(
    private route: Router,
    public userService: UserLoginService,
    public userParams: UserParametersService
  ) {
    this.user = {};
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.getDataUser();
      this.getCategory();
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
   * Método par obtener la lista de categorías
   * @memberof ToolbarLinkComponent
   */
  getCategory() {
    this.routes = RoutesConst;
    this.categoryList = RoutesConst.CATEGORYLIST;
  }

  /**
   * Método para envíar al usuario a una ruta en especifica
   * @param {CategoryList} category
   * @memberof ToolbarLinkComponent
   */
  goToRoot(category: CategoryList) {
    if (category.id !== '') {
      this.route.navigate([category.root, category.id]);
    } else {
      this.route.navigate([category.root]);
    }
  }
}
