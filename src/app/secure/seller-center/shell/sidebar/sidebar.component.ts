/* 3rd party components */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/* our own custom components */
import { ShellComponent } from '../shell.component';
import { environment } from '../../../../environments/environment';
import { Logger } from '../../utils/logger.service';
import { User } from '../../../../shared/models/login.model';
// import { LogoutComponent } from '../../../../public/auth/confirm/confirmRegistration.component';
import { Const } from '../../../../shared/util/constants';
import { RoutesConst } from '../../../../shared/util/routes.constants';
import { CategoryList } from '../../../../shared/models/order';

// log component
const log = new Logger('SideBarComponent');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  // Sidenav principal
  @Input() sidenav;
  // Información del usuario
  @Input() user: User;
  // web url. empleada para saber cual es la url del servidor
  webUrl = environment.webUrl;
  // Lista de categorías de las ordenes
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
    public shellComponent: ShellComponent
    // private logoutComponent: LogoutComponent
  ) {
  }

  /**
   * @memberof SidebarComponent
   */
  ngOnInit() {
    log.info(this.sidenav);
    // inicializo las categorías por defecto para el menú
    this.routes = RoutesConst;
    this.categoryList = this.routes.CATEGORYLIST;
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof SidebarComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
    log.info('Sidenav toggle');
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
