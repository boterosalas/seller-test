import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@app/core/aws-cognito';
import { CategoryList } from '@app/shared/models/order.model';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { environment } from '@env/environment';
import { UserInformation } from '@app/shared/models';
import { Logger } from '@app/core';
import { ModuleModel, MenuModel, ProfileTypes } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';

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
export class ToolbarLinkComponent implements OnInit {

  public routes: any;
  @Input() user: UserInformation;
  // Estructura para la categoría
  categoryEstructure = {
    root: 'home'
  };
  modules: ModuleModel[] = null;

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
    public userParams: UserParametersService,
    public authService: AuthService
  ) {
    console.log(this.user);
  }

  ngOnInit() {
    this.getCategory();
    this.authService.getModules().then( data => {
      this.modules = data;
    }, error => {
      console.error(error);
    });
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

  /**
   * Funcion que se encarga de verificar que menus se debe de mostrar y cuales no, aqui debe ir la enumeracion que envia back con los menus pertenecientes al usuario.
   *
   * @param {MenuModel} menu
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public showMenu(menu: MenuModel): boolean {
    return menu.ShowMenu && (this.isProductionEnv && menu.ShowMenuProduction || !this.isProductionEnv);
  }

  /**
   * Verifica si debe mostrar el modulo.
   *
   * @param {ModuleModel} module
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public showModule(moduleR: ModuleModel): boolean {
    const menu = moduleR.Menus.find(result => (result.ShowMenu === true));
    return menu !== undefined;
  }

  /**
   * Retorna el menu solo con la primera en mayuscula.
   *
   * @param {string} name
   * @returns {string}
   * @memberof ToolbarLinkComponent
   */
  public getPersonalityName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Verifica que debe de mostrar.
   *
   * @param {number} profileType
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public validateUserType(profileType: number): boolean {
    if (this.user) {
      return this.user.sellerProfile === 'administrator' ? profileType === ProfileTypes.Administrador : profileType === ProfileTypes.Vendedor;
    }
  }
}
