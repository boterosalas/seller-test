import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RoutesConst } from '@shared/util';
import { CategoryList, UserInformation } from '@shared/models';
import { environment } from '@env/environment';

import { LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { Logger } from '@core/util/logger.service';
import { ShellComponent } from '@core/shell/shell.component';
import { Modules, MenuModel, ProfileTypes, ModuleModel } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { CoreState } from '@app/store';

// log component
const log = new Logger('SideBarComponent');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SidebarComponent implements OnInit {
  // Sidenav principal
  @Input() sidenav;
  // Información del usuario
  @Input() user: UserInformation;
  // Define si la app esta en un entorno de producción.
  isProductionEnv = environment.production;
  // Lista de categorías de las órdenes
  categoryList: any;
  public routes = RoutesConst;
  prueba = 'solicitudes-pendientes';
  modules: ModuleModel[] = null;

  form: FormGroup;

  unreadCase: number;
  sumadevolution: number;
  devolution: number;
  pending: number;

  constructor(
    private route: Router,
    public shellComponent: ShellComponent,
    public userService: UserLoginService,
    public userParams: UserParametersService,
    public authService: AuthService,
    private fb: FormBuilder,
    private store: Store<CoreState>
  ) { }

  /**
   * @memberof SidebarComponent
   */

  getIconByName(module: ModuleModel) {
    const noAccentinLowerCase = module.NameModule.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
    const name = noAccentinLowerCase.replace(/\s+/g, '-');
    const iconsUrl = {
      'ordenes': 'orders.svg',
      'ofertas': 'products-and-offers.svg',
      'productos': 'products-and-offers.svg',
      'devoluciones': 'claims-and-returns.svg',
      'documentacion': 'config.svg',
      'parametrizacion': 'config.svg',
      'vendedores': 'seller.svg',
      'reclamaciones': 'claims-and-returns.svg',
      'reportes': 'reports.svg',
      'calidad': 'seller.svg',
      'dispersion': 'finance.svg',
    };
    return `assets/side-menu/${iconsUrl[name] || 'orders.svg'}`;
  }

  ngOnInit() {
    this.categoryList = this.routes.CATEGORYLIST;
    this.authService.getModules().then(data => {
      this.modules = data;
      console.log({ modules: data });
    }, error => {
      console.error(error);
    });

    this.store
      .pipe(select(state => state.notification))
      .subscribe(
        notificationState => {
          this.unreadCase = notificationState.unreadCases;
          this.sumadevolution = notificationState.sumaUnreadDevolutions;
          this.devolution = notificationState.unreadDevolutions;
          this.pending = notificationState.unreadPendings;
        }
      );
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
  goToRoot(category: MenuModel) {
    if (category.Id !== '') {
      this.route.navigate([category.UrlRedirect, category.Id]);
    }
  }
  public getPersonalityName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Funcion que se encarga de verificar que menus se debe de mostrar y cuales no, aqui debe ir la enumeracion que envia back con los menus pertenecientes al usuario.
   *
   * @param {MenuModel} menu
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public showMenu(menu: MenuModel, showUrlRedirect: boolean = false): boolean {
    // return menu.ShowMenu && menu.ShowMenuProduction;
    if (showUrlRedirect) {
      return menu.ShowMenu && ((this.isProductionEnv && menu.ShowMenuProduction) || !this.isProductionEnv) && showUrlRedirect && !this.showOnlyLocalMenus(menu.UrlRedirect);
    } else {
      return menu.ShowMenu && ((this.isProductionEnv && menu.ShowMenuProduction) || !this.isProductionEnv) && this.showOnlyLocalMenus(menu.UrlRedirect);
    }
  }

  /**
   * Solo abre nuevas pestañas de rutas que no poseen http en la cabecera.
   *
   * @param {string} url
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public showOnlyLocalMenus(url: string): boolean {
    return url.search('http') === -1;
  }

  /**
   * Verifica si debe mostrar el modulo.
   *
   * @param {ModuleModel} module
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public showModule(moduleR: ModuleModel): boolean {
    // const menu = moduleR.Menus.find(result => (result.ShowMenu === true && this.validateUserType(result.ProfileType)));
    const menu = moduleR.Menus.find(result => (result.ShowMenu === true));
    return menu !== undefined;
  }

  /**
   * Verifica que debe de mostrar.
   *
   * @param {number} profileType
   * @returns {boolean}
   * @memberof SidebarComponent
   */
  public validateUserType(profileType: number): boolean {
    return this.user.sellerProfile === 'administrator' ? profileType === ProfileTypes.Administrador : profileType === ProfileTypes.Vendedor;
  }

  showNotificationPoint(module: ModuleModel) {
    return module.NameModule.toLocaleLowerCase() === 'devoluciones' && (this.devolution || this.pending);
  }
}
