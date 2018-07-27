/* 3rd party components */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/* our own custom components */
import { CategoryList } from '../models/order.model';
import { RoutesConst } from '../util/routes.constants';
import { LoggedInCallback, Callback } from '../../service/cognito.service';
import { UserLoginService } from '../../service/user-login.service';
import { UserParametersService } from '../../service/user-parameters.service';

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
