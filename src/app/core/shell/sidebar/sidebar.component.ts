/* 3rd party components */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

/* our own custom components */
import { CategoryList } from '../../../components/shared/models/order';
import { Logger } from '../../utilities/logger.service';
import { Const } from '../../../components/shared/util/constants';
import { ShellComponent } from '../shell.component';
import { LogoutComponent } from '../../../components/common/login/logout/logout.component';
import { User } from '../../../components/shared/models/login.model';
import { environment } from '../../../../environments/environment';

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
    private logoutComponent: LogoutComponent
  ) { }

  /**
   * @memberof SidebarComponent
   */
  ngOnInit() {
    log.info(this.sidenav);
    // inicializo las categorías por defecto para el menú
    this.categoryList = Const.CATEGORYLIST;
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
    this.logoutComponent.logout();
  }
}
