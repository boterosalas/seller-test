import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@app/core/aws-cognito';
import { CategoryList } from '@app/shared/models/order.model';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { environment } from '@env/environment';
import { UserInformation } from '@app/shared/models';
import { Logger } from '@app/core';

const log = new Logger('ToolbarLinkComponent');

/**
 * Componente Toolbar para los links de la orden.
 *
 * @export
 * @class ToolbarLinkComponent
 * @implements {OnInit}
 * @implements {LoggedInCallback}
 * @implements {Callback}
 */
@Component({
  selector: 'app-toolbar-link',
  templateUrl: './toolbar-link.component.html',
  styleUrls: ['./toolbar-link.component.scss'],
})
export class ToolbarLinkComponent implements OnInit, LoggedInCallback {

  public routes: any;
  public user: UserInformation;
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
  ) { }

  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.getCategory();
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
    }
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