/* 3rd party components */
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import 'rxjs/add/operator/filter';

/* our own custom components */
import { ShellComponent } from './../../../../core/shell/shell.component';
import { LoadingComponent } from './../../../../core/shell/loading/loading.component';
import { UserService } from '../../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { LoginService } from '../login.service';

/**
 * Component para realizar el cierre de sesión del usuario, se centraliza este comportamiento de cerrrar sesión para no tener que crearlo en los diferentes componentes que permitan cerrar sesión
 *
 * @export
 * @class LogoutComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  providers: [
    UserService,
    ComponentsService,
    LoginService
  ]
})

export class LogoutComponent implements OnInit {

  // información del usuario
  user: any;
  @Input() action: string;

  /**
   * Creates an instance of LogoutComponent.
   * @param {UserService} userService 
   * @param {Router} router 
   * @param {LoginService} loginService 
   * @param {ComponentsService} componentService 
   * @param {ShellComponent} shellComponent 
   * @memberof LogoutComponent
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private loginService: LoginService,
    private componentService: ComponentsService,
    private shellComponent: ShellComponent
  ) {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        this.user = this.userService.getUser();
      });
  }

  /**
   * ngOnInit
   * @memberof LogoutComponent
   */
  ngOnInit() {
    this.user = this.userService.getUser();
  }

  /**
   * Método para realizar el cierre de sesión (no se ha implememntado servicio para cerrar sesión, solo se borra cache)
   * @returns
   * @memberof LogoutComponent
   */
  logout() {
    // this.shellComponent.loadingComponent.viewLoadingProgressBar();
    // this.loginService.logout(this.user.access_token).subscribe((res: any) => {
    //   this.goToInitPage();
    //   this.componentService.openSnackBar(res.message, "Aceptar");
    // }, err => {
    //   this.goToInitPage();
    // })
    this.goToInitPage();

  }

  /**
   * Método para dirigir a la pagina inicial
   * @memberof LogoutComponent
   */
  goToInitPage() {
    /* this.user = this.userService.getEmptyUser()
    this.userService.setUser(JSON.stringify(this.user)); */
    this.router.navigate(['/home']);
    this.shellComponent.stateSideNav = false;
    this.shellComponent.viewToolbarPrincipal = false;
    // this.shellComponent.loadingComponent.closeLoadingProgressBar();
  }
}
